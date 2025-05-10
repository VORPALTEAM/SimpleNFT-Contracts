import "@stdlib/deploy";
import "./message";

contract BuyerProfile with Deployable {
    
    collection_address: Address;
    collection_owner: Address?;
    collection_item_price: Int = 0;
    owner: Address;
    is_initialized: Bool = false;
    is_blacklisted: Bool;
    is_whitelisted: Bool;

    init(parent: Address, new_owner: Address) {
        self.collection_address = parent;
        self.owner = new_owner;
        self.is_blacklisted = false;
        self.is_whitelisted = false;
    }

    receive(msg: SetupCollectionData) {
        require(sender()==self.collection_address, "Parent Only");
        require(self.is_initialized == false, "Already setup");
        self.collection_owner = msg.collection_owner;
        self.collection_item_price = msg.collection_item_price;
        self.is_initialized = true;
    }

    receive("Mint"){
        require(sender() == self.owner, "Profile owner only");
        require(self.is_whitelisted() == true, "White list required");
        let ctx: Context = context();
        require(ctx.value >= self.collection_item_price, "NFT creation underpriced");
        let msgValue: Int = ctx.value;
        let tonBalanceBeforeMsg: Int = myBalance() - msgValue;
        let storageFee: Int = minTonsForStorage - min(tonBalanceBeforeMsg, minTonsForStorage);
        msgValue = msgValue - (storageFee + gasConsumption);

        send(SendParameters{
            to: self.collection_address,
            value: msgValue,
            body: MintTo{
              owner: self.owner,
            }.toCell(),
            mode: SendIgnoreErrors
        });
    }

    // Get blacklist status (still not supported)
    /* get fun is_blacklisted(): Bool {
        return self.is_blacklisted;
    } */

    // Get whitelist status
    get fun is_whitelisted(): Bool {
        return self.is_whitelisted;
    }


    // List operations
    receive(msg: AddToWhiteList) {
        require(sender() == self.collection_owner || sender() == self.collection_address, "No rights to action");
        if (msg.add == false) {
            self.is_whitelisted = false;
            return;
        }
        self.is_whitelisted = true;
        self.is_blacklisted = false;
    }

    /* receive(msg: AddToBlackList) {
        require(sender() == self.collection_owner, "No rights to action");
         if (msg.add == false) {
            self.is_blacklisted = false;
            return;
        }
        self.is_whitelisted = false;
        self.is_blacklisted = true;
    } */
}
