import "@stdlib/deploy";
import "./message.tact";

contract NftItem {
    collection_address: Address;
    item_index: Int; 
    is_initialized: Bool;

    owner: Address?;
    individual_content: Cell?;

    init(collection_address: Address, item_index: Int){
        require(sender() == collection_address, "not from collection");
        self.collection_address = collection_address;
        self.item_index = item_index;
        self.is_initialized = false;
    }

    receive(msg: Transfer){
        let ctx: Context = context(); // Reference: https://docs.tact-lang.org/language/ref/common#context
        let msgValue: Int = self.msgValue(ctx.value);
        
        if (self.is_initialized == false) {  // Initial Transfer, aka the "Minting" of the NFT
            require(ctx.sender == self.collection_address, "initialized tx need from collection");
            self.is_initialized = true;
            self.owner = msg.new_owner;
            self.individual_content = msg.custom_payload;
            send(SendParameters{
                to: msg.response_destination!!,
                value: msgValue,
                mode: SendPayGasSeparately,
                body: Excesses { query_id: msg.query_id }.toCell()
            });
        } else {
            require(ctx.sender == self.owner!!, "not owner");
            // require(self.is_sbt == 0, "Sbt cannot be transferred");
            self.owner = msg.new_owner;  // change current owner to the new_owner
            if (msg.forward_amount > 0) {
                send(SendParameters{
                    to: msg.new_owner,
                    value: msg.forward_amount,
                    mode: SendPayGasSeparately, 
                    body: OwnershipAssigned{
                        query_id: msg.query_id,
                        prev_owner: ctx.sender,
                        forward_payload: msg.forward_payload
                    }.toCell()
                }); 
            }

            msgValue = msgValue - ctx.readForwardFee(); 
            if (msg.response_destination != null) { 
                send(SendParameters{ 
                    to: msg.response_destination!!,
                    value: msgValue - msg.forward_amount,
                    mode: SendPayGasSeparately,
                    body: Excesses { query_id: msg.query_id }.toCell()
                });
            } 
        }
    }
    
    receive(msg: GetStaticData){ 
        let ctx: Context = context();
        send(SendParameters {
            to: ctx.sender,
            value: 0,
            mode: 64,  // (return msg amount except gas fees) 
            bounce: true,
            body: ReportStaticData{
                query_id: msg.query_id,
                index_id: self.item_index,
                collection: self.collection_address
            }.toCell()
        });
    }

    fun msgValue(value: Int): Int {
        let tonBalanceBeforeMsg: Int = myBalance() - value;
        let storageFee: Int = minTonsForStorage - min(tonBalanceBeforeMsg, minTonsForStorage);
        return value - (storageFee + gasConsumption);
    }

    // --------- Get Function  --------- //
    get fun get_nft_data(): GetNftData {
        let b: StringBuilder = beginString();
        let collectionData: String = (self.individual_content!!).asSlice().asString();
        b.append(collectionData);

        return GetNftData {
            is_initialized: self.is_initialized, 
            index: self.item_index, 
            collection_address: self.collection_address, 
            owner_address: self.owner!!,
            individual_content: b.toCell()
        };
    }
}

/* 

contract Nft {
    index: Int as uint64;
    collection_address: Address;
    owner_address: Address?;
    common_content: Cell?;
    content: Cell?; // nft item content uri

    init(index: Int, collection_address: Address){
        self.index = index;
        self.collection_address = collection_address;
        self.owner_address = null;
        self.common_content = null;
        self.content = null;
    }

    receive(){
        nativeThrow(0xffff);
    }

    receive(msg: Transfer){
        let ctx: Context = context();

        let sender_address: Address = ctx.sender;
        nativeThrowUnless(401, sender_address == self.owner_address!!);
        let new_owner_address: Address = msg.new_owner_address;

        // TODO: check work chain is same as new_owner_address

        let response_destination: Address? = msg.response_destination;
        let forward_amount: Int = msg.forward_amount;
        let fwd_fee: Int = ctx.readForwardFee() * 3 / 2;
        let rest_amount: Int = (myBalance() - MIN_TONS_FOR_STORAGE);
        if (forward_amount > 0) {
            rest_amount -= (forward_amount + fwd_fee);
        }
        if (response_destination != null) {
            rest_amount -= fwd_fee;
        }
        nativeThrowUnless(402, rest_amount >= 0); // base nft spends fixed amount of gas, will not check for response

        if (forward_amount > 0) {
            send(SendParameters{
                    to: new_owner_address,
                    value: forward_amount,
                    mode: SendPayGasSeparately,
                    bounce: false,
                    body: OwnershipAssigned{
                        query_id: msg.query_id,
                        prev_owner: self.owner_address!!,
                        forward_payload: msg.forward_payload
                    }.toCell()
                }
            );
        }
        if (response_destination != null) {
            // TODO: check work chain is same as response_destination
            send(SendParameters{
                    to: response_destination!!,
                    value: rest_amount,
                    mode: SendPayGasSeparately,
                    bounce: false,
                    body: Excesses{ query_id: msg.query_id }.toCell()
                }
            );
        }
        self.owner_address = new_owner_address;
    }

    receive(msg: GetStaticData){
        let ctx: Context = context();

        let sender_address: Address = ctx.sender;
        send(SendParameters{
                to: sender_address,
                value: 0,
                mode: SendRemainingValue,
                bounce: false,
                body: ReportStaticData{
                    query_id: msg.query_id,
                    index: self.index,
                    collection_address: self.collection_address
                }.toCell()
            }
        );
    }

    // Philip defined custom receiver, hehe :p
    receive(msg: DeployNft){
        let ctx: Context = context();
        let sender_address: Address = ctx.sender;

        nativeThrowUnless(405, self.collection_address == sender_address);
        
        if(self.owner_address == null && self.content == null && self.common_content == null){
            self.owner_address = msg.owner_address;
            self.common_content = msg.common_content;
            self.content = msg.content;
        }
    }

    receive(msg: Slice){
        throw(0xffff);
    }

    get fun get_nft_data(): NftData {
        if (self.owner_address != null && self.content != null) {
            return
                NftData{
                    init: -1,
                    index: self.index,
                    collection_address: self.collection_address,
                    owner_address: self.owner_address!!,
                    content: self.content!!
                };
        } else {
            return
                NftData{
                    init: 0,
                    index: self.index,
                    collection_address: self.collection_address,
                    owner_address: null,
                    content: null
                };
        }
    }
}

*/