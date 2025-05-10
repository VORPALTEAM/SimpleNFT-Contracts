import "@stdlib/deploy";
import "./message";

struct TodoDetails{
    task: String;
    completed: Bool;
}

contract BuyerProfile with Deployable {
    collection_address: Address;
    collection_owner: Address?;
    collection_item_price: Int?;
    owner: Address;
    completed: Bool = false;
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

    receive(msg: InternalComplete){
        require(sender()==self.collection_address, "Parent Only");
        self.completed = true;
        send(SendParameters{
            to: msg.excess,
            value: 0,
            mode: SendRemainingValue + SendIgnoreErrors
        });
    }

    // Get blacklist status
    get fun is_blacklisted(): Bool {
        return self.is_blacklisted;
    }

    // Get whitelist status
    get fun is_whitelisted(): Bool {
        return self.is_whitelisted;
    }


    // Blacklist operations
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
