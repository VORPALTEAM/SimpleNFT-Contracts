message LogEventMintRecord {
    minter: Address;
    item_id: Int;
    generate_number: Int;
}


message(0x693d3950) GetRoyaltyParams {
    query_id: Int as uint64;
}
message(0xa8cb00ad) ReportRoyaltyParams {
    query_id: Int as uint64;
    numerator: Int as uint16;
    denominator: Int as uint16;
    destination: Address;
}
struct CollectionData {
    next_item_index: Int;
    collection_content: Cell;
    owner_address: Address;
}
struct RoyaltyParams {
    numerator: Int;
    denominator: Int;
    destination: Address;
}
message CollectionSetupParams {
    owner_address: Address;
    master_address: Address;
    collection_content: Cell; 
    nft_individual_content_url: Cell;
    royalty_params: RoyaltyParams;
    mint_limit: Int;
    nft_price: Int;
    mint_time_limit: Int;
    is_sbt: Int;
}

message CollectionMintParams {
    queryId: Int;
    owner_address: Address;
    collection_content: Cell; 
    nft_individual_content_url: Cell;
    royalty_params: RoyaltyParams;
    mint_limit: Int;
    mint_time_limit: Int;
    is_sbt: Int;
    nft_price: Int;
}

message(0x5fcc3d14) Transfer {
    query_id: Int as uint64;
    new_owner: Address;
    response_destination: Address?;
    custom_payload: Cell?;
    forward_amount: Int as coins;
    forward_payload: Slice as remaining;
}

message(0x05138d91) OwnershipAssigned {
    query_id: Int as uint64;
    prev_owner: Address;
    forward_payload: Slice as remaining;
}
message(0xd53276db) Excesses {
    query_id: Int as uint64;
}
message(0x2fcb26a2) GetStaticData {
    query_id: Int as uint64;
}
message(0x8b771735) ReportStaticData {
    query_id: Int as uint64;
    index_id: Int;
    collection: Address;
}
struct GetNftData {
    is_initialized: Bool;
    index: Int;
    collection_address: Address;
    owner_address: Address;
    individual_content: Cell;
}

struct CollectionMasterData {
    master: Address;
    mint_limit: Int;
    price: Int;
    mint_time_limit: Int;
    is_sbt: Int;
    index_in_collection: Int;
}

const minTonsForStorage: Int = ton("0.03");
const gasConsumption: Int = ton("0.03");