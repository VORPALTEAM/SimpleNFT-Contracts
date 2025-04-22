import "@stdlib/deploy";
import "./message.tact";

// -------- Params for buyer as a black or white list --------- //
contract BuyerParams {

     collection_address: Address;
     buyer_address: Address;
     is_blacklisted: Bool?;
     is_whitelisted: Bool?;

     init(collection_address: Address, buyer_address: Address) {
        self.collection_address = collection_address;
        self.buyer_address = buyer_address;
     }

}