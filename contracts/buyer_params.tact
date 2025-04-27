import "@stdlib/deploy";
import "./message.tact";

contract BuyerProfileParams {

    collection_address: Address;
    buyer_address: Address;
    is_blacklisted: Bool;
    is_whitelisted: Bool;

    init(collection_address: Address, buyer_address: Address) {
        self.collection_address = collection_address;
        self.buyer_address = buyer_address;
        self.is_blacklisted = false;
        self.is_whitelisted = false;
    }

    // Add to blacklist
    fun addToBlacklist() {
        self.is_blacklisted = true;
        self.is_whitelisted = false; // Automatically remove from whitelist if added to blacklist
    }

    // Remove from blacklist
    fun removeFromBlacklist() {
        self.is_blacklisted = false;
    }

    // Remove from whitelist
    fun removeFromWhitelist() {
        self.is_whitelisted = false;
    }

    // Get blacklist status
    get fun is_blacklisted(): Bool {
        return self.is_blacklisted;
    }

    // Get whitelist status
    get fun is_whitelisted(): Bool {
        return self.is_whitelisted;
    }

    receive(msg: AddToWhiteList) {
        require(sender() == self.collection_address, "No rights to action");
        if (msg.add == false) {
            self.is_whitelisted = false;
            return;
        }
        self.is_whitelisted = true;
        self.is_blacklisted = false;
    }

    receive(msg: AddToBlackList) {
        require(sender() == self.collection_address, "No rights to action");
         if (msg.add == false) {
            self.is_blacklisted = false;
            return;
        }
        self.is_whitelisted = false;
        self.is_blacklisted = true;
    }
}