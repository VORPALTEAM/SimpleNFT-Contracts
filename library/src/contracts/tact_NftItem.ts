import { 
    Cell,
    Slice, 
    Address, 
    Builder, 
    beginCell, 
    ComputeError, 
    TupleItem, 
    TupleReader, 
    Dictionary, 
    contractAddress, 
    ContractProvider, 
    Sender, 
    Contract, 
    ContractABI, 
    ABIType,
    ABIGetter,
    ABIReceiver,
    TupleBuilder,
    DictionaryValue
} from '@ton/core';

export type StateInit = {
    $$type: 'StateInit';
    code: Cell;
    data: Cell;
}

export function storeStateInit(src: StateInit) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeRef(src.code);
        b_0.storeRef(src.data);
    };
}

export function loadStateInit(slice: Slice) {
    let sc_0 = slice;
    let _code = sc_0.loadRef();
    let _data = sc_0.loadRef();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function loadTupleStateInit(source: TupleReader) {
    let _code = source.readCell();
    let _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function loadGetterTupleStateInit(source: TupleReader) {
    let _code = source.readCell();
    let _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function storeTupleStateInit(source: StateInit) {
    let builder = new TupleBuilder();
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

function dictValueParserStateInit(): DictionaryValue<StateInit> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStateInit(src)).endCell());
        },
        parse: (src) => {
            return loadStateInit(src.loadRef().beginParse());
        }
    }
}

export type Context = {
    $$type: 'Context';
    bounced: boolean;
    sender: Address;
    value: bigint;
    raw: Slice;
}

export function storeContext(src: Context) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounced);
        b_0.storeAddress(src.sender);
        b_0.storeInt(src.value, 257);
        b_0.storeRef(src.raw.asCell());
    };
}

export function loadContext(slice: Slice) {
    let sc_0 = slice;
    let _bounced = sc_0.loadBit();
    let _sender = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _raw = sc_0.loadRef().asSlice();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function loadTupleContext(source: TupleReader) {
    let _bounced = source.readBoolean();
    let _sender = source.readAddress();
    let _value = source.readBigNumber();
    let _raw = source.readCell().asSlice();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function loadGetterTupleContext(source: TupleReader) {
    let _bounced = source.readBoolean();
    let _sender = source.readAddress();
    let _value = source.readBigNumber();
    let _raw = source.readCell().asSlice();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function storeTupleContext(source: Context) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.bounced);
    builder.writeAddress(source.sender);
    builder.writeNumber(source.value);
    builder.writeSlice(source.raw.asCell());
    return builder.build();
}

function dictValueParserContext(): DictionaryValue<Context> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeContext(src)).endCell());
        },
        parse: (src) => {
            return loadContext(src.loadRef().beginParse());
        }
    }
}

export type SendParameters = {
    $$type: 'SendParameters';
    bounce: boolean;
    to: Address;
    value: bigint;
    mode: bigint;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
}

export function storeSendParameters(src: SendParameters) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounce);
        b_0.storeAddress(src.to);
        b_0.storeInt(src.value, 257);
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        if (src.code !== null && src.code !== undefined) { b_0.storeBit(true).storeRef(src.code); } else { b_0.storeBit(false); }
        if (src.data !== null && src.data !== undefined) { b_0.storeBit(true).storeRef(src.data); } else { b_0.storeBit(false); }
    };
}

export function loadSendParameters(slice: Slice) {
    let sc_0 = slice;
    let _bounce = sc_0.loadBit();
    let _to = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _mode = sc_0.loadIntBig(257);
    let _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _code = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _data = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function loadTupleSendParameters(source: TupleReader) {
    let _bounce = source.readBoolean();
    let _to = source.readAddress();
    let _value = source.readBigNumber();
    let _mode = source.readBigNumber();
    let _body = source.readCellOpt();
    let _code = source.readCellOpt();
    let _data = source.readCellOpt();
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function loadGetterTupleSendParameters(source: TupleReader) {
    let _bounce = source.readBoolean();
    let _to = source.readAddress();
    let _value = source.readBigNumber();
    let _mode = source.readBigNumber();
    let _body = source.readCellOpt();
    let _code = source.readCellOpt();
    let _data = source.readCellOpt();
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function storeTupleSendParameters(source: SendParameters) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.bounce);
    builder.writeAddress(source.to);
    builder.writeNumber(source.value);
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

function dictValueParserSendParameters(): DictionaryValue<SendParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSendParameters(src)).endCell());
        },
        parse: (src) => {
            return loadSendParameters(src.loadRef().beginParse());
        }
    }
}

export type Deploy = {
    $$type: 'Deploy';
    queryId: bigint;
}

export function storeDeploy(src: Deploy) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2490013878, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeploy(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2490013878) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

function loadTupleDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

function loadGetterTupleDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

function storeTupleDeploy(source: Deploy) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserDeploy(): DictionaryValue<Deploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadDeploy(src.loadRef().beginParse());
        }
    }
}

export type DeployOk = {
    $$type: 'DeployOk';
    queryId: bigint;
}

export function storeDeployOk(src: DeployOk) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2952335191, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeployOk(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2952335191) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

function loadTupleDeployOk(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

function loadGetterTupleDeployOk(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

function storeTupleDeployOk(source: DeployOk) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserDeployOk(): DictionaryValue<DeployOk> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeployOk(src)).endCell());
        },
        parse: (src) => {
            return loadDeployOk(src.loadRef().beginParse());
        }
    }
}

export type FactoryDeploy = {
    $$type: 'FactoryDeploy';
    queryId: bigint;
    cashback: Address;
}

export function storeFactoryDeploy(src: FactoryDeploy) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1829761339, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.cashback);
    };
}

export function loadFactoryDeploy(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1829761339) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _cashback = sc_0.loadAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

function loadTupleFactoryDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _cashback = source.readAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

function loadGetterTupleFactoryDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _cashback = source.readAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

function storeTupleFactoryDeploy(source: FactoryDeploy) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.cashback);
    return builder.build();
}

function dictValueParserFactoryDeploy(): DictionaryValue<FactoryDeploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeFactoryDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadFactoryDeploy(src.loadRef().beginParse());
        }
    }
}

export type SimpleNftCollectionV2$Data = {
    $$type: 'SimpleNftCollectionV2$Data';
    next_item_index: bigint;
    collection_index: bigint;
    owner_address: Address | null;
    master_address: Address;
    royalty_params: RoyaltyParams | null;
    collection_content: Cell | null;
    individual_content_url: Cell | null;
    mint_limit: bigint;
    price: bigint;
    is_setup: boolean;
    is_sbt: bigint;
    mint_time_limit: bigint;
    enable_profile: boolean;
    user_item_limit: bigint;
    enable_whitelist: boolean;
}

export function storeSimpleNftCollectionV2$Data(src: SimpleNftCollectionV2$Data) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(src.next_item_index, 32);
        b_0.storeUint(src.collection_index, 32);
        b_0.storeAddress(src.owner_address);
        b_0.storeAddress(src.master_address);
        let b_1 = new Builder();
        if (src.royalty_params !== null && src.royalty_params !== undefined) { b_1.storeBit(true); b_1.store(storeRoyaltyParams(src.royalty_params)); } else { b_1.storeBit(false); }
        if (src.collection_content !== null && src.collection_content !== undefined) { b_1.storeBit(true).storeRef(src.collection_content); } else { b_1.storeBit(false); }
        if (src.individual_content_url !== null && src.individual_content_url !== undefined) { b_1.storeBit(true).storeRef(src.individual_content_url); } else { b_1.storeBit(false); }
        b_1.storeUint(src.mint_limit, 32);
        let b_2 = new Builder();
        b_2.storeInt(src.price, 257);
        b_2.storeBit(src.is_setup);
        b_2.storeInt(src.is_sbt, 257);
        b_2.storeUint(src.mint_time_limit, 32);
        b_2.storeBit(src.enable_profile);
        b_2.storeUint(src.user_item_limit, 8);
        b_2.storeBit(src.enable_whitelist);
        b_1.storeRef(b_2.endCell());
        b_0.storeRef(b_1.endCell());
    };
}

export function loadSimpleNftCollectionV2$Data(slice: Slice) {
    let sc_0 = slice;
    let _next_item_index = sc_0.loadUintBig(32);
    let _collection_index = sc_0.loadUintBig(32);
    let _owner_address = sc_0.loadMaybeAddress();
    let _master_address = sc_0.loadAddress();
    let sc_1 = sc_0.loadRef().beginParse();
    let _royalty_params = sc_1.loadBit() ? loadRoyaltyParams(sc_1) : null;
    let _collection_content = sc_1.loadBit() ? sc_1.loadRef() : null;
    let _individual_content_url = sc_1.loadBit() ? sc_1.loadRef() : null;
    let _mint_limit = sc_1.loadUintBig(32);
    let sc_2 = sc_1.loadRef().beginParse();
    let _price = sc_2.loadIntBig(257);
    let _is_setup = sc_2.loadBit();
    let _is_sbt = sc_2.loadIntBig(257);
    let _mint_time_limit = sc_2.loadUintBig(32);
    let _enable_profile = sc_2.loadBit();
    let _user_item_limit = sc_2.loadUintBig(8);
    let _enable_whitelist = sc_2.loadBit();
    return { $$type: 'SimpleNftCollectionV2$Data' as const, next_item_index: _next_item_index, collection_index: _collection_index, owner_address: _owner_address, master_address: _master_address, royalty_params: _royalty_params, collection_content: _collection_content, individual_content_url: _individual_content_url, mint_limit: _mint_limit, price: _price, is_setup: _is_setup, is_sbt: _is_sbt, mint_time_limit: _mint_time_limit, enable_profile: _enable_profile, user_item_limit: _user_item_limit, enable_whitelist: _enable_whitelist };
}

function loadTupleSimpleNftCollectionV2$Data(source: TupleReader) {
    let _next_item_index = source.readBigNumber();
    let _collection_index = source.readBigNumber();
    let _owner_address = source.readAddressOpt();
    let _master_address = source.readAddress();
    const _royalty_params_p = source.readTupleOpt();
    const _royalty_params = _royalty_params_p ? loadTupleRoyaltyParams(_royalty_params_p) : null;
    let _collection_content = source.readCellOpt();
    let _individual_content_url = source.readCellOpt();
    let _mint_limit = source.readBigNumber();
    let _price = source.readBigNumber();
    let _is_setup = source.readBoolean();
    let _is_sbt = source.readBigNumber();
    let _mint_time_limit = source.readBigNumber();
    let _enable_profile = source.readBoolean();
    let _user_item_limit = source.readBigNumber();
    let _enable_whitelist = source.readBoolean();
    return { $$type: 'SimpleNftCollectionV2$Data' as const, next_item_index: _next_item_index, collection_index: _collection_index, owner_address: _owner_address, master_address: _master_address, royalty_params: _royalty_params, collection_content: _collection_content, individual_content_url: _individual_content_url, mint_limit: _mint_limit, price: _price, is_setup: _is_setup, is_sbt: _is_sbt, mint_time_limit: _mint_time_limit, enable_profile: _enable_profile, user_item_limit: _user_item_limit, enable_whitelist: _enable_whitelist };
}

function loadGetterTupleSimpleNftCollectionV2$Data(source: TupleReader) {
    let _next_item_index = source.readBigNumber();
    let _collection_index = source.readBigNumber();
    let _owner_address = source.readAddressOpt();
    let _master_address = source.readAddress();
    const _royalty_params_p = source.readTupleOpt();
    const _royalty_params = _royalty_params_p ? loadTupleRoyaltyParams(_royalty_params_p) : null;
    let _collection_content = source.readCellOpt();
    let _individual_content_url = source.readCellOpt();
    let _mint_limit = source.readBigNumber();
    let _price = source.readBigNumber();
    let _is_setup = source.readBoolean();
    let _is_sbt = source.readBigNumber();
    let _mint_time_limit = source.readBigNumber();
    let _enable_profile = source.readBoolean();
    let _user_item_limit = source.readBigNumber();
    let _enable_whitelist = source.readBoolean();
    return { $$type: 'SimpleNftCollectionV2$Data' as const, next_item_index: _next_item_index, collection_index: _collection_index, owner_address: _owner_address, master_address: _master_address, royalty_params: _royalty_params, collection_content: _collection_content, individual_content_url: _individual_content_url, mint_limit: _mint_limit, price: _price, is_setup: _is_setup, is_sbt: _is_sbt, mint_time_limit: _mint_time_limit, enable_profile: _enable_profile, user_item_limit: _user_item_limit, enable_whitelist: _enable_whitelist };
}

function storeTupleSimpleNftCollectionV2$Data(source: SimpleNftCollectionV2$Data) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.next_item_index);
    builder.writeNumber(source.collection_index);
    builder.writeAddress(source.owner_address);
    builder.writeAddress(source.master_address);
    if (source.royalty_params !== null && source.royalty_params !== undefined) {
        builder.writeTuple(storeTupleRoyaltyParams(source.royalty_params));
    } else {
        builder.writeTuple(null);
    }
    builder.writeCell(source.collection_content);
    builder.writeCell(source.individual_content_url);
    builder.writeNumber(source.mint_limit);
    builder.writeNumber(source.price);
    builder.writeBoolean(source.is_setup);
    builder.writeNumber(source.is_sbt);
    builder.writeNumber(source.mint_time_limit);
    builder.writeBoolean(source.enable_profile);
    builder.writeNumber(source.user_item_limit);
    builder.writeBoolean(source.enable_whitelist);
    return builder.build();
}

function dictValueParserSimpleNftCollectionV2$Data(): DictionaryValue<SimpleNftCollectionV2$Data> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSimpleNftCollectionV2$Data(src)).endCell());
        },
        parse: (src) => {
            return loadSimpleNftCollectionV2$Data(src.loadRef().beginParse());
        }
    }
}

export type LogEventMintRecord = {
    $$type: 'LogEventMintRecord';
    minter: Address;
    item_id: bigint;
    generate_number: bigint;
}

export function storeLogEventMintRecord(src: LogEventMintRecord) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2743565669, 32);
        b_0.storeAddress(src.minter);
        b_0.storeInt(src.item_id, 257);
        b_0.storeInt(src.generate_number, 257);
    };
}

export function loadLogEventMintRecord(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2743565669) { throw Error('Invalid prefix'); }
    let _minter = sc_0.loadAddress();
    let _item_id = sc_0.loadIntBig(257);
    let _generate_number = sc_0.loadIntBig(257);
    return { $$type: 'LogEventMintRecord' as const, minter: _minter, item_id: _item_id, generate_number: _generate_number };
}

function loadTupleLogEventMintRecord(source: TupleReader) {
    let _minter = source.readAddress();
    let _item_id = source.readBigNumber();
    let _generate_number = source.readBigNumber();
    return { $$type: 'LogEventMintRecord' as const, minter: _minter, item_id: _item_id, generate_number: _generate_number };
}

function loadGetterTupleLogEventMintRecord(source: TupleReader) {
    let _minter = source.readAddress();
    let _item_id = source.readBigNumber();
    let _generate_number = source.readBigNumber();
    return { $$type: 'LogEventMintRecord' as const, minter: _minter, item_id: _item_id, generate_number: _generate_number };
}

function storeTupleLogEventMintRecord(source: LogEventMintRecord) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.minter);
    builder.writeNumber(source.item_id);
    builder.writeNumber(source.generate_number);
    return builder.build();
}

function dictValueParserLogEventMintRecord(): DictionaryValue<LogEventMintRecord> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeLogEventMintRecord(src)).endCell());
        },
        parse: (src) => {
            return loadLogEventMintRecord(src.loadRef().beginParse());
        }
    }
}

export type GetRoyaltyParams = {
    $$type: 'GetRoyaltyParams';
    query_id: bigint;
}

export function storeGetRoyaltyParams(src: GetRoyaltyParams) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1765620048, 32);
        b_0.storeUint(src.query_id, 64);
    };
}

export function loadGetRoyaltyParams(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1765620048) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    return { $$type: 'GetRoyaltyParams' as const, query_id: _query_id };
}

function loadTupleGetRoyaltyParams(source: TupleReader) {
    let _query_id = source.readBigNumber();
    return { $$type: 'GetRoyaltyParams' as const, query_id: _query_id };
}

function loadGetterTupleGetRoyaltyParams(source: TupleReader) {
    let _query_id = source.readBigNumber();
    return { $$type: 'GetRoyaltyParams' as const, query_id: _query_id };
}

function storeTupleGetRoyaltyParams(source: GetRoyaltyParams) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    return builder.build();
}

function dictValueParserGetRoyaltyParams(): DictionaryValue<GetRoyaltyParams> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeGetRoyaltyParams(src)).endCell());
        },
        parse: (src) => {
            return loadGetRoyaltyParams(src.loadRef().beginParse());
        }
    }
}

export type GetProfile = {
    $$type: 'GetProfile';
    query_id: bigint;
}

export function storeGetProfile(src: GetProfile) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3300596689, 32);
        b_0.storeUint(src.query_id, 64);
    };
}

export function loadGetProfile(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3300596689) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    return { $$type: 'GetProfile' as const, query_id: _query_id };
}

function loadTupleGetProfile(source: TupleReader) {
    let _query_id = source.readBigNumber();
    return { $$type: 'GetProfile' as const, query_id: _query_id };
}

function loadGetterTupleGetProfile(source: TupleReader) {
    let _query_id = source.readBigNumber();
    return { $$type: 'GetProfile' as const, query_id: _query_id };
}

function storeTupleGetProfile(source: GetProfile) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    return builder.build();
}

function dictValueParserGetProfile(): DictionaryValue<GetProfile> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeGetProfile(src)).endCell());
        },
        parse: (src) => {
            return loadGetProfile(src.loadRef().beginParse());
        }
    }
}

export type ReportRoyaltyParams = {
    $$type: 'ReportRoyaltyParams';
    query_id: bigint;
    numerator: bigint;
    denominator: bigint;
    destination: Address;
}

export function storeReportRoyaltyParams(src: ReportRoyaltyParams) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2831876269, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeUint(src.numerator, 16);
        b_0.storeUint(src.denominator, 16);
        b_0.storeAddress(src.destination);
    };
}

export function loadReportRoyaltyParams(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2831876269) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    let _numerator = sc_0.loadUintBig(16);
    let _denominator = sc_0.loadUintBig(16);
    let _destination = sc_0.loadAddress();
    return { $$type: 'ReportRoyaltyParams' as const, query_id: _query_id, numerator: _numerator, denominator: _denominator, destination: _destination };
}

function loadTupleReportRoyaltyParams(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _numerator = source.readBigNumber();
    let _denominator = source.readBigNumber();
    let _destination = source.readAddress();
    return { $$type: 'ReportRoyaltyParams' as const, query_id: _query_id, numerator: _numerator, denominator: _denominator, destination: _destination };
}

function loadGetterTupleReportRoyaltyParams(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _numerator = source.readBigNumber();
    let _denominator = source.readBigNumber();
    let _destination = source.readAddress();
    return { $$type: 'ReportRoyaltyParams' as const, query_id: _query_id, numerator: _numerator, denominator: _denominator, destination: _destination };
}

function storeTupleReportRoyaltyParams(source: ReportRoyaltyParams) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeNumber(source.numerator);
    builder.writeNumber(source.denominator);
    builder.writeAddress(source.destination);
    return builder.build();
}

function dictValueParserReportRoyaltyParams(): DictionaryValue<ReportRoyaltyParams> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeReportRoyaltyParams(src)).endCell());
        },
        parse: (src) => {
            return loadReportRoyaltyParams(src.loadRef().beginParse());
        }
    }
}

export type CollectionData = {
    $$type: 'CollectionData';
    next_item_index: bigint;
    collection_content: Cell;
    owner_address: Address;
}

export function storeCollectionData(src: CollectionData) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeInt(src.next_item_index, 257);
        b_0.storeRef(src.collection_content);
        b_0.storeAddress(src.owner_address);
    };
}

export function loadCollectionData(slice: Slice) {
    let sc_0 = slice;
    let _next_item_index = sc_0.loadIntBig(257);
    let _collection_content = sc_0.loadRef();
    let _owner_address = sc_0.loadAddress();
    return { $$type: 'CollectionData' as const, next_item_index: _next_item_index, collection_content: _collection_content, owner_address: _owner_address };
}

function loadTupleCollectionData(source: TupleReader) {
    let _next_item_index = source.readBigNumber();
    let _collection_content = source.readCell();
    let _owner_address = source.readAddress();
    return { $$type: 'CollectionData' as const, next_item_index: _next_item_index, collection_content: _collection_content, owner_address: _owner_address };
}

function loadGetterTupleCollectionData(source: TupleReader) {
    let _next_item_index = source.readBigNumber();
    let _collection_content = source.readCell();
    let _owner_address = source.readAddress();
    return { $$type: 'CollectionData' as const, next_item_index: _next_item_index, collection_content: _collection_content, owner_address: _owner_address };
}

function storeTupleCollectionData(source: CollectionData) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.next_item_index);
    builder.writeCell(source.collection_content);
    builder.writeAddress(source.owner_address);
    return builder.build();
}

function dictValueParserCollectionData(): DictionaryValue<CollectionData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeCollectionData(src)).endCell());
        },
        parse: (src) => {
            return loadCollectionData(src.loadRef().beginParse());
        }
    }
}

export type RoyaltyParams = {
    $$type: 'RoyaltyParams';
    numerator: bigint;
    denominator: bigint;
    destination: Address;
}

export function storeRoyaltyParams(src: RoyaltyParams) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeInt(src.numerator, 257);
        b_0.storeInt(src.denominator, 257);
        b_0.storeAddress(src.destination);
    };
}

export function loadRoyaltyParams(slice: Slice) {
    let sc_0 = slice;
    let _numerator = sc_0.loadIntBig(257);
    let _denominator = sc_0.loadIntBig(257);
    let _destination = sc_0.loadAddress();
    return { $$type: 'RoyaltyParams' as const, numerator: _numerator, denominator: _denominator, destination: _destination };
}

function loadTupleRoyaltyParams(source: TupleReader) {
    let _numerator = source.readBigNumber();
    let _denominator = source.readBigNumber();
    let _destination = source.readAddress();
    return { $$type: 'RoyaltyParams' as const, numerator: _numerator, denominator: _denominator, destination: _destination };
}

function loadGetterTupleRoyaltyParams(source: TupleReader) {
    let _numerator = source.readBigNumber();
    let _denominator = source.readBigNumber();
    let _destination = source.readAddress();
    return { $$type: 'RoyaltyParams' as const, numerator: _numerator, denominator: _denominator, destination: _destination };
}

function storeTupleRoyaltyParams(source: RoyaltyParams) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.numerator);
    builder.writeNumber(source.denominator);
    builder.writeAddress(source.destination);
    return builder.build();
}

function dictValueParserRoyaltyParams(): DictionaryValue<RoyaltyParams> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeRoyaltyParams(src)).endCell());
        },
        parse: (src) => {
            return loadRoyaltyParams(src.loadRef().beginParse());
        }
    }
}

export type CollectionSetupParams = {
    $$type: 'CollectionSetupParams';
    owner_address: Address;
    master_address: Address;
    collection_content: Cell;
    nft_individual_content_url: Cell;
    royalty_params: RoyaltyParams;
    mint_limit: bigint;
    nft_price: bigint;
    mint_time_limit: bigint;
    is_sbt: bigint;
    enable_profile: boolean;
    enable_whitelist: boolean;
    user_item_limit: bigint;
}

export function storeCollectionSetupParams(src: CollectionSetupParams) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3320246811, 32);
        b_0.storeAddress(src.owner_address);
        b_0.storeAddress(src.master_address);
        b_0.storeRef(src.collection_content);
        b_0.storeRef(src.nft_individual_content_url);
        let b_1 = new Builder();
        b_1.store(storeRoyaltyParams(src.royalty_params));
        let b_2 = new Builder();
        b_2.storeInt(src.mint_limit, 257);
        b_2.storeInt(src.nft_price, 257);
        b_2.storeInt(src.mint_time_limit, 257);
        let b_3 = new Builder();
        b_3.storeInt(src.is_sbt, 257);
        b_3.storeBit(src.enable_profile);
        b_3.storeBit(src.enable_whitelist);
        b_3.storeInt(src.user_item_limit, 257);
        b_2.storeRef(b_3.endCell());
        b_1.storeRef(b_2.endCell());
        b_0.storeRef(b_1.endCell());
    };
}

export function loadCollectionSetupParams(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3320246811) { throw Error('Invalid prefix'); }
    let _owner_address = sc_0.loadAddress();
    let _master_address = sc_0.loadAddress();
    let _collection_content = sc_0.loadRef();
    let _nft_individual_content_url = sc_0.loadRef();
    let sc_1 = sc_0.loadRef().beginParse();
    let _royalty_params = loadRoyaltyParams(sc_1);
    let sc_2 = sc_1.loadRef().beginParse();
    let _mint_limit = sc_2.loadIntBig(257);
    let _nft_price = sc_2.loadIntBig(257);
    let _mint_time_limit = sc_2.loadIntBig(257);
    let sc_3 = sc_2.loadRef().beginParse();
    let _is_sbt = sc_3.loadIntBig(257);
    let _enable_profile = sc_3.loadBit();
    let _enable_whitelist = sc_3.loadBit();
    let _user_item_limit = sc_3.loadIntBig(257);
    return { $$type: 'CollectionSetupParams' as const, owner_address: _owner_address, master_address: _master_address, collection_content: _collection_content, nft_individual_content_url: _nft_individual_content_url, royalty_params: _royalty_params, mint_limit: _mint_limit, nft_price: _nft_price, mint_time_limit: _mint_time_limit, is_sbt: _is_sbt, enable_profile: _enable_profile, enable_whitelist: _enable_whitelist, user_item_limit: _user_item_limit };
}

function loadTupleCollectionSetupParams(source: TupleReader) {
    let _owner_address = source.readAddress();
    let _master_address = source.readAddress();
    let _collection_content = source.readCell();
    let _nft_individual_content_url = source.readCell();
    const _royalty_params = loadTupleRoyaltyParams(source);
    let _mint_limit = source.readBigNumber();
    let _nft_price = source.readBigNumber();
    let _mint_time_limit = source.readBigNumber();
    let _is_sbt = source.readBigNumber();
    let _enable_profile = source.readBoolean();
    let _enable_whitelist = source.readBoolean();
    let _user_item_limit = source.readBigNumber();
    return { $$type: 'CollectionSetupParams' as const, owner_address: _owner_address, master_address: _master_address, collection_content: _collection_content, nft_individual_content_url: _nft_individual_content_url, royalty_params: _royalty_params, mint_limit: _mint_limit, nft_price: _nft_price, mint_time_limit: _mint_time_limit, is_sbt: _is_sbt, enable_profile: _enable_profile, enable_whitelist: _enable_whitelist, user_item_limit: _user_item_limit };
}

function loadGetterTupleCollectionSetupParams(source: TupleReader) {
    let _owner_address = source.readAddress();
    let _master_address = source.readAddress();
    let _collection_content = source.readCell();
    let _nft_individual_content_url = source.readCell();
    const _royalty_params = loadGetterTupleRoyaltyParams(source);
    let _mint_limit = source.readBigNumber();
    let _nft_price = source.readBigNumber();
    let _mint_time_limit = source.readBigNumber();
    let _is_sbt = source.readBigNumber();
    let _enable_profile = source.readBoolean();
    let _enable_whitelist = source.readBoolean();
    let _user_item_limit = source.readBigNumber();
    return { $$type: 'CollectionSetupParams' as const, owner_address: _owner_address, master_address: _master_address, collection_content: _collection_content, nft_individual_content_url: _nft_individual_content_url, royalty_params: _royalty_params, mint_limit: _mint_limit, nft_price: _nft_price, mint_time_limit: _mint_time_limit, is_sbt: _is_sbt, enable_profile: _enable_profile, enable_whitelist: _enable_whitelist, user_item_limit: _user_item_limit };
}

function storeTupleCollectionSetupParams(source: CollectionSetupParams) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.owner_address);
    builder.writeAddress(source.master_address);
    builder.writeCell(source.collection_content);
    builder.writeCell(source.nft_individual_content_url);
    builder.writeTuple(storeTupleRoyaltyParams(source.royalty_params));
    builder.writeNumber(source.mint_limit);
    builder.writeNumber(source.nft_price);
    builder.writeNumber(source.mint_time_limit);
    builder.writeNumber(source.is_sbt);
    builder.writeBoolean(source.enable_profile);
    builder.writeBoolean(source.enable_whitelist);
    builder.writeNumber(source.user_item_limit);
    return builder.build();
}

function dictValueParserCollectionSetupParams(): DictionaryValue<CollectionSetupParams> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeCollectionSetupParams(src)).endCell());
        },
        parse: (src) => {
            return loadCollectionSetupParams(src.loadRef().beginParse());
        }
    }
}

export type UpdateWhiteList = {
    $$type: 'UpdateWhiteList';
    user: Address;
    whitelist: boolean;
}

export function storeUpdateWhiteList(src: UpdateWhiteList) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2983121044, 32);
        b_0.storeAddress(src.user);
        b_0.storeBit(src.whitelist);
    };
}

export function loadUpdateWhiteList(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2983121044) { throw Error('Invalid prefix'); }
    let _user = sc_0.loadAddress();
    let _whitelist = sc_0.loadBit();
    return { $$type: 'UpdateWhiteList' as const, user: _user, whitelist: _whitelist };
}

function loadTupleUpdateWhiteList(source: TupleReader) {
    let _user = source.readAddress();
    let _whitelist = source.readBoolean();
    return { $$type: 'UpdateWhiteList' as const, user: _user, whitelist: _whitelist };
}

function loadGetterTupleUpdateWhiteList(source: TupleReader) {
    let _user = source.readAddress();
    let _whitelist = source.readBoolean();
    return { $$type: 'UpdateWhiteList' as const, user: _user, whitelist: _whitelist };
}

function storeTupleUpdateWhiteList(source: UpdateWhiteList) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.user);
    builder.writeBoolean(source.whitelist);
    return builder.build();
}

function dictValueParserUpdateWhiteList(): DictionaryValue<UpdateWhiteList> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeUpdateWhiteList(src)).endCell());
        },
        parse: (src) => {
            return loadUpdateWhiteList(src.loadRef().beginParse());
        }
    }
}

export type AddToWhiteList = {
    $$type: 'AddToWhiteList';
    add: boolean;
}

export function storeAddToWhiteList(src: AddToWhiteList) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2854654268, 32);
        b_0.storeBit(src.add);
    };
}

export function loadAddToWhiteList(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2854654268) { throw Error('Invalid prefix'); }
    let _add = sc_0.loadBit();
    return { $$type: 'AddToWhiteList' as const, add: _add };
}

function loadTupleAddToWhiteList(source: TupleReader) {
    let _add = source.readBoolean();
    return { $$type: 'AddToWhiteList' as const, add: _add };
}

function loadGetterTupleAddToWhiteList(source: TupleReader) {
    let _add = source.readBoolean();
    return { $$type: 'AddToWhiteList' as const, add: _add };
}

function storeTupleAddToWhiteList(source: AddToWhiteList) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.add);
    return builder.build();
}

function dictValueParserAddToWhiteList(): DictionaryValue<AddToWhiteList> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAddToWhiteList(src)).endCell());
        },
        parse: (src) => {
            return loadAddToWhiteList(src.loadRef().beginParse());
        }
    }
}

export type CollectionMintParams = {
    $$type: 'CollectionMintParams';
    queryId: bigint;
    owner_address: Address;
    collection_content: Cell;
    nft_individual_content_url: Cell;
    royalty_params: RoyaltyParams;
    mint_limit: bigint;
    mint_time_limit: bigint;
    is_sbt: bigint;
    nft_price: bigint;
    enable_profile: boolean;
    enable_whitelist: boolean;
    user_item_limit: bigint;
}

export function storeCollectionMintParams(src: CollectionMintParams) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3164622941, 32);
        b_0.storeInt(src.queryId, 257);
        b_0.storeAddress(src.owner_address);
        b_0.storeRef(src.collection_content);
        b_0.storeRef(src.nft_individual_content_url);
        let b_1 = new Builder();
        b_1.store(storeRoyaltyParams(src.royalty_params));
        let b_2 = new Builder();
        b_2.storeInt(src.mint_limit, 257);
        b_2.storeInt(src.mint_time_limit, 257);
        b_2.storeInt(src.is_sbt, 257);
        let b_3 = new Builder();
        b_3.storeInt(src.nft_price, 257);
        b_3.storeBit(src.enable_profile);
        b_3.storeBit(src.enable_whitelist);
        b_3.storeInt(src.user_item_limit, 257);
        b_2.storeRef(b_3.endCell());
        b_1.storeRef(b_2.endCell());
        b_0.storeRef(b_1.endCell());
    };
}

export function loadCollectionMintParams(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3164622941) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadIntBig(257);
    let _owner_address = sc_0.loadAddress();
    let _collection_content = sc_0.loadRef();
    let _nft_individual_content_url = sc_0.loadRef();
    let sc_1 = sc_0.loadRef().beginParse();
    let _royalty_params = loadRoyaltyParams(sc_1);
    let sc_2 = sc_1.loadRef().beginParse();
    let _mint_limit = sc_2.loadIntBig(257);
    let _mint_time_limit = sc_2.loadIntBig(257);
    let _is_sbt = sc_2.loadIntBig(257);
    let sc_3 = sc_2.loadRef().beginParse();
    let _nft_price = sc_3.loadIntBig(257);
    let _enable_profile = sc_3.loadBit();
    let _enable_whitelist = sc_3.loadBit();
    let _user_item_limit = sc_3.loadIntBig(257);
    return { $$type: 'CollectionMintParams' as const, queryId: _queryId, owner_address: _owner_address, collection_content: _collection_content, nft_individual_content_url: _nft_individual_content_url, royalty_params: _royalty_params, mint_limit: _mint_limit, mint_time_limit: _mint_time_limit, is_sbt: _is_sbt, nft_price: _nft_price, enable_profile: _enable_profile, enable_whitelist: _enable_whitelist, user_item_limit: _user_item_limit };
}

function loadTupleCollectionMintParams(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _owner_address = source.readAddress();
    let _collection_content = source.readCell();
    let _nft_individual_content_url = source.readCell();
    const _royalty_params = loadTupleRoyaltyParams(source);
    let _mint_limit = source.readBigNumber();
    let _mint_time_limit = source.readBigNumber();
    let _is_sbt = source.readBigNumber();
    let _nft_price = source.readBigNumber();
    let _enable_profile = source.readBoolean();
    let _enable_whitelist = source.readBoolean();
    let _user_item_limit = source.readBigNumber();
    return { $$type: 'CollectionMintParams' as const, queryId: _queryId, owner_address: _owner_address, collection_content: _collection_content, nft_individual_content_url: _nft_individual_content_url, royalty_params: _royalty_params, mint_limit: _mint_limit, mint_time_limit: _mint_time_limit, is_sbt: _is_sbt, nft_price: _nft_price, enable_profile: _enable_profile, enable_whitelist: _enable_whitelist, user_item_limit: _user_item_limit };
}

function loadGetterTupleCollectionMintParams(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _owner_address = source.readAddress();
    let _collection_content = source.readCell();
    let _nft_individual_content_url = source.readCell();
    const _royalty_params = loadGetterTupleRoyaltyParams(source);
    let _mint_limit = source.readBigNumber();
    let _mint_time_limit = source.readBigNumber();
    let _is_sbt = source.readBigNumber();
    let _nft_price = source.readBigNumber();
    let _enable_profile = source.readBoolean();
    let _enable_whitelist = source.readBoolean();
    let _user_item_limit = source.readBigNumber();
    return { $$type: 'CollectionMintParams' as const, queryId: _queryId, owner_address: _owner_address, collection_content: _collection_content, nft_individual_content_url: _nft_individual_content_url, royalty_params: _royalty_params, mint_limit: _mint_limit, mint_time_limit: _mint_time_limit, is_sbt: _is_sbt, nft_price: _nft_price, enable_profile: _enable_profile, enable_whitelist: _enable_whitelist, user_item_limit: _user_item_limit };
}

function storeTupleCollectionMintParams(source: CollectionMintParams) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.owner_address);
    builder.writeCell(source.collection_content);
    builder.writeCell(source.nft_individual_content_url);
    builder.writeTuple(storeTupleRoyaltyParams(source.royalty_params));
    builder.writeNumber(source.mint_limit);
    builder.writeNumber(source.mint_time_limit);
    builder.writeNumber(source.is_sbt);
    builder.writeNumber(source.nft_price);
    builder.writeBoolean(source.enable_profile);
    builder.writeBoolean(source.enable_whitelist);
    builder.writeNumber(source.user_item_limit);
    return builder.build();
}

function dictValueParserCollectionMintParams(): DictionaryValue<CollectionMintParams> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeCollectionMintParams(src)).endCell());
        },
        parse: (src) => {
            return loadCollectionMintParams(src.loadRef().beginParse());
        }
    }
}

export type ProfileData = {
    $$type: 'ProfileData';
    query_id: bigint;
    user: Address;
    is_whitelisted: boolean;
    is_blacklisted: boolean;
}

export function storeProfileData(src: ProfileData) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1499272752, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeAddress(src.user);
        b_0.storeBit(src.is_whitelisted);
        b_0.storeBit(src.is_blacklisted);
    };
}

export function loadProfileData(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1499272752) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    let _user = sc_0.loadAddress();
    let _is_whitelisted = sc_0.loadBit();
    let _is_blacklisted = sc_0.loadBit();
    return { $$type: 'ProfileData' as const, query_id: _query_id, user: _user, is_whitelisted: _is_whitelisted, is_blacklisted: _is_blacklisted };
}

function loadTupleProfileData(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _user = source.readAddress();
    let _is_whitelisted = source.readBoolean();
    let _is_blacklisted = source.readBoolean();
    return { $$type: 'ProfileData' as const, query_id: _query_id, user: _user, is_whitelisted: _is_whitelisted, is_blacklisted: _is_blacklisted };
}

function loadGetterTupleProfileData(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _user = source.readAddress();
    let _is_whitelisted = source.readBoolean();
    let _is_blacklisted = source.readBoolean();
    return { $$type: 'ProfileData' as const, query_id: _query_id, user: _user, is_whitelisted: _is_whitelisted, is_blacklisted: _is_blacklisted };
}

function storeTupleProfileData(source: ProfileData) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeAddress(source.user);
    builder.writeBoolean(source.is_whitelisted);
    builder.writeBoolean(source.is_blacklisted);
    return builder.build();
}

function dictValueParserProfileData(): DictionaryValue<ProfileData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeProfileData(src)).endCell());
        },
        parse: (src) => {
            return loadProfileData(src.loadRef().beginParse());
        }
    }
}

export type Transfer = {
    $$type: 'Transfer';
    query_id: bigint;
    new_owner: Address;
    response_destination: Address | null;
    custom_payload: Cell | null;
    forward_amount: bigint;
    forward_payload: Slice;
}

export function storeTransfer(src: Transfer) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1607220500, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeAddress(src.new_owner);
        b_0.storeAddress(src.response_destination);
        if (src.custom_payload !== null && src.custom_payload !== undefined) { b_0.storeBit(true).storeRef(src.custom_payload); } else { b_0.storeBit(false); }
        b_0.storeCoins(src.forward_amount);
        b_0.storeBuilder(src.forward_payload.asBuilder());
    };
}

export function loadTransfer(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1607220500) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    let _new_owner = sc_0.loadAddress();
    let _response_destination = sc_0.loadMaybeAddress();
    let _custom_payload = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _forward_amount = sc_0.loadCoins();
    let _forward_payload = sc_0;
    return { $$type: 'Transfer' as const, query_id: _query_id, new_owner: _new_owner, response_destination: _response_destination, custom_payload: _custom_payload, forward_amount: _forward_amount, forward_payload: _forward_payload };
}

function loadTupleTransfer(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _new_owner = source.readAddress();
    let _response_destination = source.readAddressOpt();
    let _custom_payload = source.readCellOpt();
    let _forward_amount = source.readBigNumber();
    let _forward_payload = source.readCell().asSlice();
    return { $$type: 'Transfer' as const, query_id: _query_id, new_owner: _new_owner, response_destination: _response_destination, custom_payload: _custom_payload, forward_amount: _forward_amount, forward_payload: _forward_payload };
}

function loadGetterTupleTransfer(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _new_owner = source.readAddress();
    let _response_destination = source.readAddressOpt();
    let _custom_payload = source.readCellOpt();
    let _forward_amount = source.readBigNumber();
    let _forward_payload = source.readCell().asSlice();
    return { $$type: 'Transfer' as const, query_id: _query_id, new_owner: _new_owner, response_destination: _response_destination, custom_payload: _custom_payload, forward_amount: _forward_amount, forward_payload: _forward_payload };
}

function storeTupleTransfer(source: Transfer) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeAddress(source.new_owner);
    builder.writeAddress(source.response_destination);
    builder.writeCell(source.custom_payload);
    builder.writeNumber(source.forward_amount);
    builder.writeSlice(source.forward_payload.asCell());
    return builder.build();
}

function dictValueParserTransfer(): DictionaryValue<Transfer> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTransfer(src)).endCell());
        },
        parse: (src) => {
            return loadTransfer(src.loadRef().beginParse());
        }
    }
}

export type OwnershipAssigned = {
    $$type: 'OwnershipAssigned';
    query_id: bigint;
    prev_owner: Address;
    forward_payload: Slice;
}

export function storeOwnershipAssigned(src: OwnershipAssigned) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(85167505, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeAddress(src.prev_owner);
        b_0.storeBuilder(src.forward_payload.asBuilder());
    };
}

export function loadOwnershipAssigned(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 85167505) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    let _prev_owner = sc_0.loadAddress();
    let _forward_payload = sc_0;
    return { $$type: 'OwnershipAssigned' as const, query_id: _query_id, prev_owner: _prev_owner, forward_payload: _forward_payload };
}

function loadTupleOwnershipAssigned(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _prev_owner = source.readAddress();
    let _forward_payload = source.readCell().asSlice();
    return { $$type: 'OwnershipAssigned' as const, query_id: _query_id, prev_owner: _prev_owner, forward_payload: _forward_payload };
}

function loadGetterTupleOwnershipAssigned(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _prev_owner = source.readAddress();
    let _forward_payload = source.readCell().asSlice();
    return { $$type: 'OwnershipAssigned' as const, query_id: _query_id, prev_owner: _prev_owner, forward_payload: _forward_payload };
}

function storeTupleOwnershipAssigned(source: OwnershipAssigned) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeAddress(source.prev_owner);
    builder.writeSlice(source.forward_payload.asCell());
    return builder.build();
}

function dictValueParserOwnershipAssigned(): DictionaryValue<OwnershipAssigned> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeOwnershipAssigned(src)).endCell());
        },
        parse: (src) => {
            return loadOwnershipAssigned(src.loadRef().beginParse());
        }
    }
}

export type Excesses = {
    $$type: 'Excesses';
    query_id: bigint;
}

export function storeExcesses(src: Excesses) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3576854235, 32);
        b_0.storeUint(src.query_id, 64);
    };
}

export function loadExcesses(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3576854235) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    return { $$type: 'Excesses' as const, query_id: _query_id };
}

function loadTupleExcesses(source: TupleReader) {
    let _query_id = source.readBigNumber();
    return { $$type: 'Excesses' as const, query_id: _query_id };
}

function loadGetterTupleExcesses(source: TupleReader) {
    let _query_id = source.readBigNumber();
    return { $$type: 'Excesses' as const, query_id: _query_id };
}

function storeTupleExcesses(source: Excesses) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    return builder.build();
}

function dictValueParserExcesses(): DictionaryValue<Excesses> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeExcesses(src)).endCell());
        },
        parse: (src) => {
            return loadExcesses(src.loadRef().beginParse());
        }
    }
}

export type GetStaticData = {
    $$type: 'GetStaticData';
    query_id: bigint;
}

export function storeGetStaticData(src: GetStaticData) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(801842850, 32);
        b_0.storeUint(src.query_id, 64);
    };
}

export function loadGetStaticData(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 801842850) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    return { $$type: 'GetStaticData' as const, query_id: _query_id };
}

function loadTupleGetStaticData(source: TupleReader) {
    let _query_id = source.readBigNumber();
    return { $$type: 'GetStaticData' as const, query_id: _query_id };
}

function loadGetterTupleGetStaticData(source: TupleReader) {
    let _query_id = source.readBigNumber();
    return { $$type: 'GetStaticData' as const, query_id: _query_id };
}

function storeTupleGetStaticData(source: GetStaticData) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    return builder.build();
}

function dictValueParserGetStaticData(): DictionaryValue<GetStaticData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeGetStaticData(src)).endCell());
        },
        parse: (src) => {
            return loadGetStaticData(src.loadRef().beginParse());
        }
    }
}

export type ReportStaticData = {
    $$type: 'ReportStaticData';
    query_id: bigint;
    index_id: bigint;
    collection: Address;
}

export function storeReportStaticData(src: ReportStaticData) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2339837749, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeInt(src.index_id, 257);
        b_0.storeAddress(src.collection);
    };
}

export function loadReportStaticData(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2339837749) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    let _index_id = sc_0.loadIntBig(257);
    let _collection = sc_0.loadAddress();
    return { $$type: 'ReportStaticData' as const, query_id: _query_id, index_id: _index_id, collection: _collection };
}

function loadTupleReportStaticData(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _index_id = source.readBigNumber();
    let _collection = source.readAddress();
    return { $$type: 'ReportStaticData' as const, query_id: _query_id, index_id: _index_id, collection: _collection };
}

function loadGetterTupleReportStaticData(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _index_id = source.readBigNumber();
    let _collection = source.readAddress();
    return { $$type: 'ReportStaticData' as const, query_id: _query_id, index_id: _index_id, collection: _collection };
}

function storeTupleReportStaticData(source: ReportStaticData) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeNumber(source.index_id);
    builder.writeAddress(source.collection);
    return builder.build();
}

function dictValueParserReportStaticData(): DictionaryValue<ReportStaticData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeReportStaticData(src)).endCell());
        },
        parse: (src) => {
            return loadReportStaticData(src.loadRef().beginParse());
        }
    }
}

export type GetNftData = {
    $$type: 'GetNftData';
    is_initialized: boolean;
    index: bigint;
    collection_address: Address;
    owner_address: Address;
    individual_content: Cell;
}

export function storeGetNftData(src: GetNftData) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.is_initialized);
        b_0.storeInt(src.index, 257);
        b_0.storeAddress(src.collection_address);
        b_0.storeAddress(src.owner_address);
        b_0.storeRef(src.individual_content);
    };
}

export function loadGetNftData(slice: Slice) {
    let sc_0 = slice;
    let _is_initialized = sc_0.loadBit();
    let _index = sc_0.loadIntBig(257);
    let _collection_address = sc_0.loadAddress();
    let _owner_address = sc_0.loadAddress();
    let _individual_content = sc_0.loadRef();
    return { $$type: 'GetNftData' as const, is_initialized: _is_initialized, index: _index, collection_address: _collection_address, owner_address: _owner_address, individual_content: _individual_content };
}

function loadTupleGetNftData(source: TupleReader) {
    let _is_initialized = source.readBoolean();
    let _index = source.readBigNumber();
    let _collection_address = source.readAddress();
    let _owner_address = source.readAddress();
    let _individual_content = source.readCell();
    return { $$type: 'GetNftData' as const, is_initialized: _is_initialized, index: _index, collection_address: _collection_address, owner_address: _owner_address, individual_content: _individual_content };
}

function loadGetterTupleGetNftData(source: TupleReader) {
    let _is_initialized = source.readBoolean();
    let _index = source.readBigNumber();
    let _collection_address = source.readAddress();
    let _owner_address = source.readAddress();
    let _individual_content = source.readCell();
    return { $$type: 'GetNftData' as const, is_initialized: _is_initialized, index: _index, collection_address: _collection_address, owner_address: _owner_address, individual_content: _individual_content };
}

function storeTupleGetNftData(source: GetNftData) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.is_initialized);
    builder.writeNumber(source.index);
    builder.writeAddress(source.collection_address);
    builder.writeAddress(source.owner_address);
    builder.writeCell(source.individual_content);
    return builder.build();
}

function dictValueParserGetNftData(): DictionaryValue<GetNftData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeGetNftData(src)).endCell());
        },
        parse: (src) => {
            return loadGetNftData(src.loadRef().beginParse());
        }
    }
}

export type CollectionMasterData = {
    $$type: 'CollectionMasterData';
    master: Address;
    mint_limit: bigint;
    price: bigint;
    mint_time_limit: bigint;
    is_sbt: bigint;
    index_in_collection: bigint;
}

export function storeCollectionMasterData(src: CollectionMasterData) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.master);
        b_0.storeInt(src.mint_limit, 257);
        b_0.storeInt(src.price, 257);
        let b_1 = new Builder();
        b_1.storeInt(src.mint_time_limit, 257);
        b_1.storeInt(src.is_sbt, 257);
        b_1.storeInt(src.index_in_collection, 257);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadCollectionMasterData(slice: Slice) {
    let sc_0 = slice;
    let _master = sc_0.loadAddress();
    let _mint_limit = sc_0.loadIntBig(257);
    let _price = sc_0.loadIntBig(257);
    let sc_1 = sc_0.loadRef().beginParse();
    let _mint_time_limit = sc_1.loadIntBig(257);
    let _is_sbt = sc_1.loadIntBig(257);
    let _index_in_collection = sc_1.loadIntBig(257);
    return { $$type: 'CollectionMasterData' as const, master: _master, mint_limit: _mint_limit, price: _price, mint_time_limit: _mint_time_limit, is_sbt: _is_sbt, index_in_collection: _index_in_collection };
}

function loadTupleCollectionMasterData(source: TupleReader) {
    let _master = source.readAddress();
    let _mint_limit = source.readBigNumber();
    let _price = source.readBigNumber();
    let _mint_time_limit = source.readBigNumber();
    let _is_sbt = source.readBigNumber();
    let _index_in_collection = source.readBigNumber();
    return { $$type: 'CollectionMasterData' as const, master: _master, mint_limit: _mint_limit, price: _price, mint_time_limit: _mint_time_limit, is_sbt: _is_sbt, index_in_collection: _index_in_collection };
}

function loadGetterTupleCollectionMasterData(source: TupleReader) {
    let _master = source.readAddress();
    let _mint_limit = source.readBigNumber();
    let _price = source.readBigNumber();
    let _mint_time_limit = source.readBigNumber();
    let _is_sbt = source.readBigNumber();
    let _index_in_collection = source.readBigNumber();
    return { $$type: 'CollectionMasterData' as const, master: _master, mint_limit: _mint_limit, price: _price, mint_time_limit: _mint_time_limit, is_sbt: _is_sbt, index_in_collection: _index_in_collection };
}

function storeTupleCollectionMasterData(source: CollectionMasterData) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.master);
    builder.writeNumber(source.mint_limit);
    builder.writeNumber(source.price);
    builder.writeNumber(source.mint_time_limit);
    builder.writeNumber(source.is_sbt);
    builder.writeNumber(source.index_in_collection);
    return builder.build();
}

function dictValueParserCollectionMasterData(): DictionaryValue<CollectionMasterData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeCollectionMasterData(src)).endCell());
        },
        parse: (src) => {
            return loadCollectionMasterData(src.loadRef().beginParse());
        }
    }
}

export type CollectionMasterDataV2 = {
    $$type: 'CollectionMasterDataV2';
    master: Address;
    mint_limit: bigint;
    price: bigint;
    mint_time_limit: bigint;
    is_sbt: bigint;
    index_in_collection: bigint;
    enable_whitelist: boolean;
    user_item_limit: bigint;
}

export function storeCollectionMasterDataV2(src: CollectionMasterDataV2) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.master);
        b_0.storeInt(src.mint_limit, 257);
        b_0.storeInt(src.price, 257);
        let b_1 = new Builder();
        b_1.storeInt(src.mint_time_limit, 257);
        b_1.storeInt(src.is_sbt, 257);
        b_1.storeInt(src.index_in_collection, 257);
        b_1.storeBit(src.enable_whitelist);
        let b_2 = new Builder();
        b_2.storeInt(src.user_item_limit, 257);
        b_1.storeRef(b_2.endCell());
        b_0.storeRef(b_1.endCell());
    };
}

export function loadCollectionMasterDataV2(slice: Slice) {
    let sc_0 = slice;
    let _master = sc_0.loadAddress();
    let _mint_limit = sc_0.loadIntBig(257);
    let _price = sc_0.loadIntBig(257);
    let sc_1 = sc_0.loadRef().beginParse();
    let _mint_time_limit = sc_1.loadIntBig(257);
    let _is_sbt = sc_1.loadIntBig(257);
    let _index_in_collection = sc_1.loadIntBig(257);
    let _enable_whitelist = sc_1.loadBit();
    let sc_2 = sc_1.loadRef().beginParse();
    let _user_item_limit = sc_2.loadIntBig(257);
    return { $$type: 'CollectionMasterDataV2' as const, master: _master, mint_limit: _mint_limit, price: _price, mint_time_limit: _mint_time_limit, is_sbt: _is_sbt, index_in_collection: _index_in_collection, enable_whitelist: _enable_whitelist, user_item_limit: _user_item_limit };
}

function loadTupleCollectionMasterDataV2(source: TupleReader) {
    let _master = source.readAddress();
    let _mint_limit = source.readBigNumber();
    let _price = source.readBigNumber();
    let _mint_time_limit = source.readBigNumber();
    let _is_sbt = source.readBigNumber();
    let _index_in_collection = source.readBigNumber();
    let _enable_whitelist = source.readBoolean();
    let _user_item_limit = source.readBigNumber();
    return { $$type: 'CollectionMasterDataV2' as const, master: _master, mint_limit: _mint_limit, price: _price, mint_time_limit: _mint_time_limit, is_sbt: _is_sbt, index_in_collection: _index_in_collection, enable_whitelist: _enable_whitelist, user_item_limit: _user_item_limit };
}

function loadGetterTupleCollectionMasterDataV2(source: TupleReader) {
    let _master = source.readAddress();
    let _mint_limit = source.readBigNumber();
    let _price = source.readBigNumber();
    let _mint_time_limit = source.readBigNumber();
    let _is_sbt = source.readBigNumber();
    let _index_in_collection = source.readBigNumber();
    let _enable_whitelist = source.readBoolean();
    let _user_item_limit = source.readBigNumber();
    return { $$type: 'CollectionMasterDataV2' as const, master: _master, mint_limit: _mint_limit, price: _price, mint_time_limit: _mint_time_limit, is_sbt: _is_sbt, index_in_collection: _index_in_collection, enable_whitelist: _enable_whitelist, user_item_limit: _user_item_limit };
}

function storeTupleCollectionMasterDataV2(source: CollectionMasterDataV2) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.master);
    builder.writeNumber(source.mint_limit);
    builder.writeNumber(source.price);
    builder.writeNumber(source.mint_time_limit);
    builder.writeNumber(source.is_sbt);
    builder.writeNumber(source.index_in_collection);
    builder.writeBoolean(source.enable_whitelist);
    builder.writeNumber(source.user_item_limit);
    return builder.build();
}

function dictValueParserCollectionMasterDataV2(): DictionaryValue<CollectionMasterDataV2> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeCollectionMasterDataV2(src)).endCell());
        },
        parse: (src) => {
            return loadCollectionMasterDataV2(src.loadRef().beginParse());
        }
    }
}

export type MintTo = {
    $$type: 'MintTo';
    owner: Address;
}

export function storeMintTo(src: MintTo) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(340819044, 32);
        b_0.storeAddress(src.owner);
    };
}

export function loadMintTo(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 340819044) { throw Error('Invalid prefix'); }
    let _owner = sc_0.loadAddress();
    return { $$type: 'MintTo' as const, owner: _owner };
}

function loadTupleMintTo(source: TupleReader) {
    let _owner = source.readAddress();
    return { $$type: 'MintTo' as const, owner: _owner };
}

function loadGetterTupleMintTo(source: TupleReader) {
    let _owner = source.readAddress();
    return { $$type: 'MintTo' as const, owner: _owner };
}

function storeTupleMintTo(source: MintTo) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.owner);
    return builder.build();
}

function dictValueParserMintTo(): DictionaryValue<MintTo> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeMintTo(src)).endCell());
        },
        parse: (src) => {
            return loadMintTo(src.loadRef().beginParse());
        }
    }
}

export type MassUpdateWhiteList = {
    $$type: 'MassUpdateWhiteList';
    addresses: Cell;
    add: boolean;
    spendPerAddress: bigint;
}

export function storeMassUpdateWhiteList(src: MassUpdateWhiteList) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1197680529, 32);
        b_0.storeRef(src.addresses);
        b_0.storeBit(src.add);
        b_0.storeUint(src.spendPerAddress, 64);
    };
}

export function loadMassUpdateWhiteList(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1197680529) { throw Error('Invalid prefix'); }
    let _addresses = sc_0.loadRef();
    let _add = sc_0.loadBit();
    let _spendPerAddress = sc_0.loadUintBig(64);
    return { $$type: 'MassUpdateWhiteList' as const, addresses: _addresses, add: _add, spendPerAddress: _spendPerAddress };
}

function loadTupleMassUpdateWhiteList(source: TupleReader) {
    let _addresses = source.readCell();
    let _add = source.readBoolean();
    let _spendPerAddress = source.readBigNumber();
    return { $$type: 'MassUpdateWhiteList' as const, addresses: _addresses, add: _add, spendPerAddress: _spendPerAddress };
}

function loadGetterTupleMassUpdateWhiteList(source: TupleReader) {
    let _addresses = source.readCell();
    let _add = source.readBoolean();
    let _spendPerAddress = source.readBigNumber();
    return { $$type: 'MassUpdateWhiteList' as const, addresses: _addresses, add: _add, spendPerAddress: _spendPerAddress };
}

function storeTupleMassUpdateWhiteList(source: MassUpdateWhiteList) {
    let builder = new TupleBuilder();
    builder.writeCell(source.addresses);
    builder.writeBoolean(source.add);
    builder.writeNumber(source.spendPerAddress);
    return builder.build();
}

function dictValueParserMassUpdateWhiteList(): DictionaryValue<MassUpdateWhiteList> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeMassUpdateWhiteList(src)).endCell());
        },
        parse: (src) => {
            return loadMassUpdateWhiteList(src.loadRef().beginParse());
        }
    }
}

export type SetupCollectionData = {
    $$type: 'SetupCollectionData';
    collection_owner: Address | null;
    collection_item_price: bigint;
    user_item_limit: bigint;
    enable_whitelist: boolean;
}

export function storeSetupCollectionData(src: SetupCollectionData) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(562350832, 32);
        b_0.storeAddress(src.collection_owner);
        b_0.storeInt(src.collection_item_price, 257);
        b_0.storeInt(src.user_item_limit, 257);
        b_0.storeBit(src.enable_whitelist);
    };
}

export function loadSetupCollectionData(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 562350832) { throw Error('Invalid prefix'); }
    let _collection_owner = sc_0.loadMaybeAddress();
    let _collection_item_price = sc_0.loadIntBig(257);
    let _user_item_limit = sc_0.loadIntBig(257);
    let _enable_whitelist = sc_0.loadBit();
    return { $$type: 'SetupCollectionData' as const, collection_owner: _collection_owner, collection_item_price: _collection_item_price, user_item_limit: _user_item_limit, enable_whitelist: _enable_whitelist };
}

function loadTupleSetupCollectionData(source: TupleReader) {
    let _collection_owner = source.readAddressOpt();
    let _collection_item_price = source.readBigNumber();
    let _user_item_limit = source.readBigNumber();
    let _enable_whitelist = source.readBoolean();
    return { $$type: 'SetupCollectionData' as const, collection_owner: _collection_owner, collection_item_price: _collection_item_price, user_item_limit: _user_item_limit, enable_whitelist: _enable_whitelist };
}

function loadGetterTupleSetupCollectionData(source: TupleReader) {
    let _collection_owner = source.readAddressOpt();
    let _collection_item_price = source.readBigNumber();
    let _user_item_limit = source.readBigNumber();
    let _enable_whitelist = source.readBoolean();
    return { $$type: 'SetupCollectionData' as const, collection_owner: _collection_owner, collection_item_price: _collection_item_price, user_item_limit: _user_item_limit, enable_whitelist: _enable_whitelist };
}

function storeTupleSetupCollectionData(source: SetupCollectionData) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.collection_owner);
    builder.writeNumber(source.collection_item_price);
    builder.writeNumber(source.user_item_limit);
    builder.writeBoolean(source.enable_whitelist);
    return builder.build();
}

function dictValueParserSetupCollectionData(): DictionaryValue<SetupCollectionData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSetupCollectionData(src)).endCell());
        },
        parse: (src) => {
            return loadSetupCollectionData(src.loadRef().beginParse());
        }
    }
}

export type CompleteTodo = {
    $$type: 'CompleteTodo';
    seqno: bigint;
}

export function storeCompleteTodo(src: CompleteTodo) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2587315870, 32);
        b_0.storeUint(src.seqno, 256);
    };
}

export function loadCompleteTodo(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2587315870) { throw Error('Invalid prefix'); }
    let _seqno = sc_0.loadUintBig(256);
    return { $$type: 'CompleteTodo' as const, seqno: _seqno };
}

function loadTupleCompleteTodo(source: TupleReader) {
    let _seqno = source.readBigNumber();
    return { $$type: 'CompleteTodo' as const, seqno: _seqno };
}

function loadGetterTupleCompleteTodo(source: TupleReader) {
    let _seqno = source.readBigNumber();
    return { $$type: 'CompleteTodo' as const, seqno: _seqno };
}

function storeTupleCompleteTodo(source: CompleteTodo) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.seqno);
    return builder.build();
}

function dictValueParserCompleteTodo(): DictionaryValue<CompleteTodo> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeCompleteTodo(src)).endCell());
        },
        parse: (src) => {
            return loadCompleteTodo(src.loadRef().beginParse());
        }
    }
}

export type InternalComplete = {
    $$type: 'InternalComplete';
    excess: Address;
}

export function storeInternalComplete(src: InternalComplete) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3472919628, 32);
        b_0.storeAddress(src.excess);
    };
}

export function loadInternalComplete(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3472919628) { throw Error('Invalid prefix'); }
    let _excess = sc_0.loadAddress();
    return { $$type: 'InternalComplete' as const, excess: _excess };
}

function loadTupleInternalComplete(source: TupleReader) {
    let _excess = source.readAddress();
    return { $$type: 'InternalComplete' as const, excess: _excess };
}

function loadGetterTupleInternalComplete(source: TupleReader) {
    let _excess = source.readAddress();
    return { $$type: 'InternalComplete' as const, excess: _excess };
}

function storeTupleInternalComplete(source: InternalComplete) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.excess);
    return builder.build();
}

function dictValueParserInternalComplete(): DictionaryValue<InternalComplete> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeInternalComplete(src)).endCell());
        },
        parse: (src) => {
            return loadInternalComplete(src.loadRef().beginParse());
        }
    }
}

export type InternalAdd = {
    $$type: 'InternalAdd';
    amount: bigint;
    origin: Address;
}

export function storeInternalAdd(src: InternalAdd) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(306259763, 32);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.origin);
    };
}

export function loadInternalAdd(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 306259763) { throw Error('Invalid prefix'); }
    let _amount = sc_0.loadCoins();
    let _origin = sc_0.loadAddress();
    return { $$type: 'InternalAdd' as const, amount: _amount, origin: _origin };
}

function loadTupleInternalAdd(source: TupleReader) {
    let _amount = source.readBigNumber();
    let _origin = source.readAddress();
    return { $$type: 'InternalAdd' as const, amount: _amount, origin: _origin };
}

function loadGetterTupleInternalAdd(source: TupleReader) {
    let _amount = source.readBigNumber();
    let _origin = source.readAddress();
    return { $$type: 'InternalAdd' as const, amount: _amount, origin: _origin };
}

function storeTupleInternalAdd(source: InternalAdd) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.amount);
    builder.writeAddress(source.origin);
    return builder.build();
}

function dictValueParserInternalAdd(): DictionaryValue<InternalAdd> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeInternalAdd(src)).endCell());
        },
        parse: (src) => {
            return loadInternalAdd(src.loadRef().beginParse());
        }
    }
}

export type TransferOwner = {
    $$type: 'TransferOwner';
    new_owner: Address;
}

export function storeTransferOwner(src: TransferOwner) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(836118768, 32);
        b_0.storeAddress(src.new_owner);
    };
}

export function loadTransferOwner(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 836118768) { throw Error('Invalid prefix'); }
    let _new_owner = sc_0.loadAddress();
    return { $$type: 'TransferOwner' as const, new_owner: _new_owner };
}

function loadTupleTransferOwner(source: TupleReader) {
    let _new_owner = source.readAddress();
    return { $$type: 'TransferOwner' as const, new_owner: _new_owner };
}

function loadGetterTupleTransferOwner(source: TupleReader) {
    let _new_owner = source.readAddress();
    return { $$type: 'TransferOwner' as const, new_owner: _new_owner };
}

function storeTupleTransferOwner(source: TransferOwner) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.new_owner);
    return builder.build();
}

function dictValueParserTransferOwner(): DictionaryValue<TransferOwner> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTransferOwner(src)).endCell());
        },
        parse: (src) => {
            return loadTransferOwner(src.loadRef().beginParse());
        }
    }
}

export type Withdraw = {
    $$type: 'Withdraw';
    to: Address;
}

export function storeWithdraw(src: Withdraw) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1318511648, 32);
        b_0.storeAddress(src.to);
    };
}

export function loadWithdraw(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1318511648) { throw Error('Invalid prefix'); }
    let _to = sc_0.loadAddress();
    return { $$type: 'Withdraw' as const, to: _to };
}

function loadTupleWithdraw(source: TupleReader) {
    let _to = source.readAddress();
    return { $$type: 'Withdraw' as const, to: _to };
}

function loadGetterTupleWithdraw(source: TupleReader) {
    let _to = source.readAddress();
    return { $$type: 'Withdraw' as const, to: _to };
}

function storeTupleWithdraw(source: Withdraw) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.to);
    return builder.build();
}

function dictValueParserWithdraw(): DictionaryValue<Withdraw> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeWithdraw(src)).endCell());
        },
        parse: (src) => {
            return loadWithdraw(src.loadRef().beginParse());
        }
    }
}

export type MasterData = {
    $$type: 'MasterData';
    master: Address;
    next_collection_index: bigint;
    collection_creation_price: bigint;
}

export function storeMasterData(src: MasterData) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.master);
        b_0.storeInt(src.next_collection_index, 257);
        b_0.storeInt(src.collection_creation_price, 257);
    };
}

export function loadMasterData(slice: Slice) {
    let sc_0 = slice;
    let _master = sc_0.loadAddress();
    let _next_collection_index = sc_0.loadIntBig(257);
    let _collection_creation_price = sc_0.loadIntBig(257);
    return { $$type: 'MasterData' as const, master: _master, next_collection_index: _next_collection_index, collection_creation_price: _collection_creation_price };
}

function loadTupleMasterData(source: TupleReader) {
    let _master = source.readAddress();
    let _next_collection_index = source.readBigNumber();
    let _collection_creation_price = source.readBigNumber();
    return { $$type: 'MasterData' as const, master: _master, next_collection_index: _next_collection_index, collection_creation_price: _collection_creation_price };
}

function loadGetterTupleMasterData(source: TupleReader) {
    let _master = source.readAddress();
    let _next_collection_index = source.readBigNumber();
    let _collection_creation_price = source.readBigNumber();
    return { $$type: 'MasterData' as const, master: _master, next_collection_index: _next_collection_index, collection_creation_price: _collection_creation_price };
}

function storeTupleMasterData(source: MasterData) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.master);
    builder.writeNumber(source.next_collection_index);
    builder.writeNumber(source.collection_creation_price);
    return builder.build();
}

function dictValueParserMasterData(): DictionaryValue<MasterData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeMasterData(src)).endCell());
        },
        parse: (src) => {
            return loadMasterData(src.loadRef().beginParse());
        }
    }
}

export type NftItem$Data = {
    $$type: 'NftItem$Data';
    collection_address: Address;
    item_index: bigint;
    is_initialized: boolean;
    owner: Address | null;
    individual_content: Cell | null;
}

export function storeNftItem$Data(src: NftItem$Data) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.collection_address);
        b_0.storeUint(src.item_index, 32);
        b_0.storeBit(src.is_initialized);
        b_0.storeAddress(src.owner);
        if (src.individual_content !== null && src.individual_content !== undefined) { b_0.storeBit(true).storeRef(src.individual_content); } else { b_0.storeBit(false); }
    };
}

export function loadNftItem$Data(slice: Slice) {
    let sc_0 = slice;
    let _collection_address = sc_0.loadAddress();
    let _item_index = sc_0.loadUintBig(32);
    let _is_initialized = sc_0.loadBit();
    let _owner = sc_0.loadMaybeAddress();
    let _individual_content = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'NftItem$Data' as const, collection_address: _collection_address, item_index: _item_index, is_initialized: _is_initialized, owner: _owner, individual_content: _individual_content };
}

function loadTupleNftItem$Data(source: TupleReader) {
    let _collection_address = source.readAddress();
    let _item_index = source.readBigNumber();
    let _is_initialized = source.readBoolean();
    let _owner = source.readAddressOpt();
    let _individual_content = source.readCellOpt();
    return { $$type: 'NftItem$Data' as const, collection_address: _collection_address, item_index: _item_index, is_initialized: _is_initialized, owner: _owner, individual_content: _individual_content };
}

function loadGetterTupleNftItem$Data(source: TupleReader) {
    let _collection_address = source.readAddress();
    let _item_index = source.readBigNumber();
    let _is_initialized = source.readBoolean();
    let _owner = source.readAddressOpt();
    let _individual_content = source.readCellOpt();
    return { $$type: 'NftItem$Data' as const, collection_address: _collection_address, item_index: _item_index, is_initialized: _is_initialized, owner: _owner, individual_content: _individual_content };
}

function storeTupleNftItem$Data(source: NftItem$Data) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.collection_address);
    builder.writeNumber(source.item_index);
    builder.writeBoolean(source.is_initialized);
    builder.writeAddress(source.owner);
    builder.writeCell(source.individual_content);
    return builder.build();
}

function dictValueParserNftItem$Data(): DictionaryValue<NftItem$Data> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeNftItem$Data(src)).endCell());
        },
        parse: (src) => {
            return loadNftItem$Data(src.loadRef().beginParse());
        }
    }
}

export type SbtItem$Data = {
    $$type: 'SbtItem$Data';
    collection_address: Address;
    item_index: bigint;
    is_initialized: boolean;
    owner: Address | null;
    individual_content: Cell | null;
}

export function storeSbtItem$Data(src: SbtItem$Data) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.collection_address);
        b_0.storeUint(src.item_index, 32);
        b_0.storeBit(src.is_initialized);
        b_0.storeAddress(src.owner);
        if (src.individual_content !== null && src.individual_content !== undefined) { b_0.storeBit(true).storeRef(src.individual_content); } else { b_0.storeBit(false); }
    };
}

export function loadSbtItem$Data(slice: Slice) {
    let sc_0 = slice;
    let _collection_address = sc_0.loadAddress();
    let _item_index = sc_0.loadUintBig(32);
    let _is_initialized = sc_0.loadBit();
    let _owner = sc_0.loadMaybeAddress();
    let _individual_content = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'SbtItem$Data' as const, collection_address: _collection_address, item_index: _item_index, is_initialized: _is_initialized, owner: _owner, individual_content: _individual_content };
}

function loadTupleSbtItem$Data(source: TupleReader) {
    let _collection_address = source.readAddress();
    let _item_index = source.readBigNumber();
    let _is_initialized = source.readBoolean();
    let _owner = source.readAddressOpt();
    let _individual_content = source.readCellOpt();
    return { $$type: 'SbtItem$Data' as const, collection_address: _collection_address, item_index: _item_index, is_initialized: _is_initialized, owner: _owner, individual_content: _individual_content };
}

function loadGetterTupleSbtItem$Data(source: TupleReader) {
    let _collection_address = source.readAddress();
    let _item_index = source.readBigNumber();
    let _is_initialized = source.readBoolean();
    let _owner = source.readAddressOpt();
    let _individual_content = source.readCellOpt();
    return { $$type: 'SbtItem$Data' as const, collection_address: _collection_address, item_index: _item_index, is_initialized: _is_initialized, owner: _owner, individual_content: _individual_content };
}

function storeTupleSbtItem$Data(source: SbtItem$Data) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.collection_address);
    builder.writeNumber(source.item_index);
    builder.writeBoolean(source.is_initialized);
    builder.writeAddress(source.owner);
    builder.writeCell(source.individual_content);
    return builder.build();
}

function dictValueParserSbtItem$Data(): DictionaryValue<SbtItem$Data> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSbtItem$Data(src)).endCell());
        },
        parse: (src) => {
            return loadSbtItem$Data(src.loadRef().beginParse());
        }
    }
}

export type BuyerProfile$Data = {
    $$type: 'BuyerProfile$Data';
    collection_address: Address;
    collection_owner: Address | null;
    collection_item_price: bigint;
    owner: Address;
    is_initialized: boolean;
    is_whitelisted: boolean;
    enable_whitelist: boolean;
    user_item_limit: bigint;
    user_item_count: bigint;
}

export function storeBuyerProfile$Data(src: BuyerProfile$Data) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.collection_address);
        b_0.storeAddress(src.collection_owner);
        b_0.storeUint(src.collection_item_price, 32);
        b_0.storeAddress(src.owner);
        b_0.storeBit(src.is_initialized);
        b_0.storeBit(src.is_whitelisted);
        b_0.storeBit(src.enable_whitelist);
        b_0.storeUint(src.user_item_limit, 8);
        b_0.storeUint(src.user_item_count, 8);
    };
}

export function loadBuyerProfile$Data(slice: Slice) {
    let sc_0 = slice;
    let _collection_address = sc_0.loadAddress();
    let _collection_owner = sc_0.loadMaybeAddress();
    let _collection_item_price = sc_0.loadUintBig(32);
    let _owner = sc_0.loadAddress();
    let _is_initialized = sc_0.loadBit();
    let _is_whitelisted = sc_0.loadBit();
    let _enable_whitelist = sc_0.loadBit();
    let _user_item_limit = sc_0.loadUintBig(8);
    let _user_item_count = sc_0.loadUintBig(8);
    return { $$type: 'BuyerProfile$Data' as const, collection_address: _collection_address, collection_owner: _collection_owner, collection_item_price: _collection_item_price, owner: _owner, is_initialized: _is_initialized, is_whitelisted: _is_whitelisted, enable_whitelist: _enable_whitelist, user_item_limit: _user_item_limit, user_item_count: _user_item_count };
}

function loadTupleBuyerProfile$Data(source: TupleReader) {
    let _collection_address = source.readAddress();
    let _collection_owner = source.readAddressOpt();
    let _collection_item_price = source.readBigNumber();
    let _owner = source.readAddress();
    let _is_initialized = source.readBoolean();
    let _is_whitelisted = source.readBoolean();
    let _enable_whitelist = source.readBoolean();
    let _user_item_limit = source.readBigNumber();
    let _user_item_count = source.readBigNumber();
    return { $$type: 'BuyerProfile$Data' as const, collection_address: _collection_address, collection_owner: _collection_owner, collection_item_price: _collection_item_price, owner: _owner, is_initialized: _is_initialized, is_whitelisted: _is_whitelisted, enable_whitelist: _enable_whitelist, user_item_limit: _user_item_limit, user_item_count: _user_item_count };
}

function loadGetterTupleBuyerProfile$Data(source: TupleReader) {
    let _collection_address = source.readAddress();
    let _collection_owner = source.readAddressOpt();
    let _collection_item_price = source.readBigNumber();
    let _owner = source.readAddress();
    let _is_initialized = source.readBoolean();
    let _is_whitelisted = source.readBoolean();
    let _enable_whitelist = source.readBoolean();
    let _user_item_limit = source.readBigNumber();
    let _user_item_count = source.readBigNumber();
    return { $$type: 'BuyerProfile$Data' as const, collection_address: _collection_address, collection_owner: _collection_owner, collection_item_price: _collection_item_price, owner: _owner, is_initialized: _is_initialized, is_whitelisted: _is_whitelisted, enable_whitelist: _enable_whitelist, user_item_limit: _user_item_limit, user_item_count: _user_item_count };
}

function storeTupleBuyerProfile$Data(source: BuyerProfile$Data) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.collection_address);
    builder.writeAddress(source.collection_owner);
    builder.writeNumber(source.collection_item_price);
    builder.writeAddress(source.owner);
    builder.writeBoolean(source.is_initialized);
    builder.writeBoolean(source.is_whitelisted);
    builder.writeBoolean(source.enable_whitelist);
    builder.writeNumber(source.user_item_limit);
    builder.writeNumber(source.user_item_count);
    return builder.build();
}

function dictValueParserBuyerProfile$Data(): DictionaryValue<BuyerProfile$Data> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBuyerProfile$Data(src)).endCell());
        },
        parse: (src) => {
            return loadBuyerProfile$Data(src.loadRef().beginParse());
        }
    }
}

export type SimpleNftMaster$Data = {
    $$type: 'SimpleNftMaster$Data';
    owner: Address;
    next_collection_index: bigint;
    collection_creation_price: bigint;
}

export function storeSimpleNftMaster$Data(src: SimpleNftMaster$Data) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeInt(src.next_collection_index, 257);
        b_0.storeUint(src.collection_creation_price, 32);
    };
}

export function loadSimpleNftMaster$Data(slice: Slice) {
    let sc_0 = slice;
    let _owner = sc_0.loadAddress();
    let _next_collection_index = sc_0.loadIntBig(257);
    let _collection_creation_price = sc_0.loadUintBig(32);
    return { $$type: 'SimpleNftMaster$Data' as const, owner: _owner, next_collection_index: _next_collection_index, collection_creation_price: _collection_creation_price };
}

function loadTupleSimpleNftMaster$Data(source: TupleReader) {
    let _owner = source.readAddress();
    let _next_collection_index = source.readBigNumber();
    let _collection_creation_price = source.readBigNumber();
    return { $$type: 'SimpleNftMaster$Data' as const, owner: _owner, next_collection_index: _next_collection_index, collection_creation_price: _collection_creation_price };
}

function loadGetterTupleSimpleNftMaster$Data(source: TupleReader) {
    let _owner = source.readAddress();
    let _next_collection_index = source.readBigNumber();
    let _collection_creation_price = source.readBigNumber();
    return { $$type: 'SimpleNftMaster$Data' as const, owner: _owner, next_collection_index: _next_collection_index, collection_creation_price: _collection_creation_price };
}

function storeTupleSimpleNftMaster$Data(source: SimpleNftMaster$Data) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.owner);
    builder.writeNumber(source.next_collection_index);
    builder.writeNumber(source.collection_creation_price);
    return builder.build();
}

function dictValueParserSimpleNftMaster$Data(): DictionaryValue<SimpleNftMaster$Data> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSimpleNftMaster$Data(src)).endCell());
        },
        parse: (src) => {
            return loadSimpleNftMaster$Data(src.loadRef().beginParse());
        }
    }
}

 type NftItem_init_args = {
    $$type: 'NftItem_init_args';
    collection_address: Address;
    item_index: bigint;
}

function initNftItem_init_args(src: NftItem_init_args) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.collection_address);
        b_0.storeInt(src.item_index, 257);
    };
}

async function NftItem_init(collection_address: Address, item_index: bigint) {
    const __code = Cell.fromBase64('te6ccgECFgEABSAAART/APSkE/S88sgLAQIBYgIDA3rQAdDTAwFxsKMB+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiFRQUwNvBPhhAvhi2zxVFNs88uCCEQQFAgFYDxADWgGSMH/gcCHXScIflTAg1wsf3iCCEF/MPRS6jwUw2zxsFuCCEC/LJqK64wIwcAYHCADYyPhDAcx/AcoAVUBQVCDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFhLLH8oAWCBulTBwAcsBjh4g10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxbiIW6zlX8BygDMlHAyygDiye1UANzTHwGCEF/MPRS68uCB0z/6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIASDXCwHDAI4f+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiJRy1yFt4gHSAAGR1JJtAeL6AFFVFRRDMAOS+EFvJBBOED1MuivbPCPAAI6xNl8DNzc4OCSBa2sHxwUW8vR/BSBu8tCAcQPIAYIQ1TJ221jLH8s/yUcwf1UwbW3bPOMOUDMEfwkNCgHC0x8BghAvyyaiuvLggdM/ATH4QW8kECNfA3CAQH9UNInIVSCCEIt3FzVQBMsfEss/gQEBzwABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8WyRA0QTAUQzBtbds8fw0ALPgnbxAhoYIITEtAZrYIoYIItxsAoKED6DeCAMCAAiBu8tCALccFEvL0U3TCAI7IU5xxERHIVSCCEAUTjZFQBMsfEss/ASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFgHPFskmEDoCERABf1UwbW3bPBBskjg94hA7SpjbPKEhbrOTWzUw4w1ZDQsMAGRsMfpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4Igw+gAxcdch+gAx+gAwpwOrAAFGASBu8tCAB6FxA8gBghDVMnbbWMsfyz/JEDdBcH9VMG1t2zwNAcrIcQHKAVAHAcoAcAHKAlAFINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8WUAP6AnABymgjbrORf5MkbrPilzMzAXABygDjDSFus5x/AcoAASBu8tCAAcyVMXABygDiyQH7AA4AmH8BygDIcAHKAHABygAkbrOdfwHKAAQgbvLQgFAEzJY0A3ABygDiJG6znX8BygAEIG7y0IBQBMyWNANwAcoA4nABygACfwHKAALJWMwCEbj8/bPNs8bFWBESABG4K+7UTQ0gABgB7u1E0NQB+GPSAAGOX/pAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgB0x/SACDXCwHDAI4f+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiJRy1yFt4gHSAAGR1JJtAeJVQGwV4Pgo1wsKgwm68uCJEwFgyG8AAW+MbW+MISBu8tCA0Ns8IiBu8tCAAW8iAcmTIW6zlgFvIlnMyegxJFRGMChZFQFW+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiAGBAQHXAFkC0QHbPBQAIG1tggDBPfhCUlDHBfL0cFkAuiDXSiHXSZcgwgAiwgCxjkoDbyKAfyLPMasCoQWrAlFVtgggwgCcIKoCFdcYUDPPFkAU3llvAlNBocIAmcgBbwJQRKGqAo4SMTPCAJnUMNAg10oh10mScCDi4uhfAw==');
    const __system = Cell.fromBase64('te6cckECGAEABSoAAQHAAQEFoPPVAgEU/wD0pBP0vPLICwMCAWIEEAN60AHQ0wMBcbCjAfpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IhUUFMDbwT4YQL4Yts8VRTbPPLgghIFDwNaAZIwf+BwIddJwh+VMCDXCx/eIIIQX8w9FLqPBTDbPGwW4IIQL8smorrjAjBwBgcMANzTHwGCEF/MPRS68uCB0z/6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIASDXCwHDAI4f+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiJRy1yFt4gHSAAGR1JJtAeL6AFFVFRRDMAOS+EFvJBBOED1MuivbPCPAAI6xNl8DNzc4OCSBa2sHxwUW8vR/BSBu8tCAcQPIAYIQ1TJ221jLH8s/yUcwf1UwbW3bPOMOUDMEfwgNCQAs+CdvECGhgghMS0Bmtgihggi3GwCgoQPoN4IAwIACIG7y0IAtxwUS8vRTdMIAjshTnHEREchVIIIQBRONkVAEyx8Syz8BINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8WAc8WySYQOgIREAF/VTBtbds8EGySOD3iEDtKmNs8oSFus5NbNTDjDVkNCgsAZGwx+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiDD6ADFx1yH6ADH6ADCnA6sAAUYBIG7y0IAHoXEDyAGCENUydttYyx/LP8kQN0Fwf1UwbW3bPA0BwtMfAYIQL8smorry4IHTPwEx+EFvJBAjXwNwgEB/VDSJyFUgghCLdxc1UATLHxLLP4EBAc8AASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFskQNEEwFEMwbW3bPH8NAcrIcQHKAVAHAcoAcAHKAlAFINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8WUAP6AnABymgjbrORf5MkbrPilzMzAXABygDjDSFus5x/AcoAASBu8tCAAcyVMXABygDiyQH7AA4AmH8BygDIcAHKAHABygAkbrOdfwHKAAQgbvLQgFAEzJY0A3ABygDiJG6znX8BygAEIG7y0IBQBMyWNANwAcoA4nABygACfwHKAALJWMwA2Mj4QwHMfwHKAFVAUFQg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxYSyx/KAFggbpUwcAHLAY4eINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8W4iFus5V/AcoAzJRwMsoA4sntVAIBWBEXAhG4/P2zzbPGxVgSFQHu7UTQ1AH4Y9IAAY5f+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiAHTH9IAINcLAcMAjh/6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIlHLXIW3iAdIAAZHUkm0B4lVAbBXg+CjXCwqDCbry4IkTAVb6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIAYEBAdcAWQLRAds8FAAgbW2CAME9+EJSUMcF8vRwWQFgyG8AAW+MbW+MISBu8tCA0Ns8IiBu8tCAAW8iAcmTIW6zlgFvIlnMyegxJFRGMChZFgC6INdKIddJlyDCACLCALGOSgNvIoB/Is8xqwKhBasCUVW2CCDCAJwgqgIV1xhQM88WQBTeWW8CU0GhwgCZyAFvAlBEoaoCjhIxM8IAmdQw0CDXSiHXSZJwIOLi6F8DABG4K+7UTQ0gABhMqudG');
    let builder = beginCell();
    builder.storeRef(__system);
    builder.storeUint(0, 1);
    initNftItem_init_args({ $$type: 'NftItem_init_args', collection_address, item_index })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}

const NftItem_errors: { [key: number]: { message: string } } = {
    2: { message: `Stack underflow` },
    3: { message: `Stack overflow` },
    4: { message: `Integer overflow` },
    5: { message: `Integer out of expected range` },
    6: { message: `Invalid opcode` },
    7: { message: `Type check error` },
    8: { message: `Cell overflow` },
    9: { message: `Cell underflow` },
    10: { message: `Dictionary error` },
    13: { message: `Out of gas error` },
    32: { message: `Method ID not found` },
    34: { message: `Action is invalid or not supported` },
    37: { message: `Not enough TON` },
    38: { message: `Not enough extra-currencies` },
    128: { message: `Null reference exception` },
    129: { message: `Invalid serialization prefix` },
    130: { message: `Invalid incoming message` },
    131: { message: `Constraints error` },
    132: { message: `Access denied` },
    133: { message: `Contract stopped` },
    134: { message: `Invalid argument` },
    135: { message: `Code of a contract was not found` },
    136: { message: `Invalid address` },
    137: { message: `Masterchain support is not enabled for this contract` },
    1040: { message: `Parent Only` },
    1139: { message: `NFT creation underpriced` },
    2575: { message: `Not from master` },
    4183: { message: `Mint time limit reached` },
    5887: { message: `Token price too low` },
    15074: { message: `Not from owner` },
    16095: { message: `non-sequential Collections` },
    18532: { message: `From profile only` },
    27071: { message: `White list required` },
    27499: { message: `initialized tx need from collection` },
    28288: { message: `Not a collection owner` },
    30203: { message: `Profile not nessesary for this collection` },
    31551: { message: `Creation underpriced` },
    34877: { message: `Collection settings is not setup` },
    39515: { message: `Collection settings is already setup` },
    48619: { message: `1` },
    48823: { message: `Profile owner only` },
    49280: { message: `not owner` },
    49469: { message: `not from collection` },
    51255: { message: `Another method for profiles` },
    53651: { message: `Sbt transfer for init only` },
    55378: { message: `Mint limit per user reached` },
    56768: { message: `Collection must have time to mint` },
    57324: { message: `Mint limit reached` },
    59318: { message: `Already setup` },
    62742: { message: `non-sequential NFTs` },
}

const NftItem_types: ABIType[] = [
    {"name":"StateInit","header":null,"fields":[{"name":"code","type":{"kind":"simple","type":"cell","optional":false}},{"name":"data","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"Context","header":null,"fields":[{"name":"bounced","type":{"kind":"simple","type":"bool","optional":false}},{"name":"sender","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"raw","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"SendParameters","header":null,"fields":[{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"code","type":{"kind":"simple","type":"cell","optional":true}},{"name":"data","type":{"kind":"simple","type":"cell","optional":true}}]},
    {"name":"Deploy","header":2490013878,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"DeployOk","header":2952335191,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"FactoryDeploy","header":1829761339,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"cashback","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"SimpleNftCollectionV2$Data","header":null,"fields":[{"name":"next_item_index","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"collection_index","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"owner_address","type":{"kind":"simple","type":"address","optional":true}},{"name":"master_address","type":{"kind":"simple","type":"address","optional":false}},{"name":"royalty_params","type":{"kind":"simple","type":"RoyaltyParams","optional":true}},{"name":"collection_content","type":{"kind":"simple","type":"cell","optional":true}},{"name":"individual_content_url","type":{"kind":"simple","type":"cell","optional":true}},{"name":"mint_limit","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"price","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"is_setup","type":{"kind":"simple","type":"bool","optional":false}},{"name":"is_sbt","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"mint_time_limit","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"enable_profile","type":{"kind":"simple","type":"bool","optional":false}},{"name":"user_item_limit","type":{"kind":"simple","type":"uint","optional":false,"format":8}},{"name":"enable_whitelist","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"LogEventMintRecord","header":2743565669,"fields":[{"name":"minter","type":{"kind":"simple","type":"address","optional":false}},{"name":"item_id","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"generate_number","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"GetRoyaltyParams","header":1765620048,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"GetProfile","header":3300596689,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"ReportRoyaltyParams","header":2831876269,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"numerator","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"denominator","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"destination","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"CollectionData","header":null,"fields":[{"name":"next_item_index","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"collection_content","type":{"kind":"simple","type":"cell","optional":false}},{"name":"owner_address","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"RoyaltyParams","header":null,"fields":[{"name":"numerator","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"denominator","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"destination","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"CollectionSetupParams","header":3320246811,"fields":[{"name":"owner_address","type":{"kind":"simple","type":"address","optional":false}},{"name":"master_address","type":{"kind":"simple","type":"address","optional":false}},{"name":"collection_content","type":{"kind":"simple","type":"cell","optional":false}},{"name":"nft_individual_content_url","type":{"kind":"simple","type":"cell","optional":false}},{"name":"royalty_params","type":{"kind":"simple","type":"RoyaltyParams","optional":false}},{"name":"mint_limit","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"nft_price","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"mint_time_limit","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"is_sbt","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"enable_profile","type":{"kind":"simple","type":"bool","optional":false}},{"name":"enable_whitelist","type":{"kind":"simple","type":"bool","optional":false}},{"name":"user_item_limit","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"UpdateWhiteList","header":2983121044,"fields":[{"name":"user","type":{"kind":"simple","type":"address","optional":false}},{"name":"whitelist","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"AddToWhiteList","header":2854654268,"fields":[{"name":"add","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"CollectionMintParams","header":3164622941,"fields":[{"name":"queryId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"owner_address","type":{"kind":"simple","type":"address","optional":false}},{"name":"collection_content","type":{"kind":"simple","type":"cell","optional":false}},{"name":"nft_individual_content_url","type":{"kind":"simple","type":"cell","optional":false}},{"name":"royalty_params","type":{"kind":"simple","type":"RoyaltyParams","optional":false}},{"name":"mint_limit","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"mint_time_limit","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"is_sbt","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"nft_price","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"enable_profile","type":{"kind":"simple","type":"bool","optional":false}},{"name":"enable_whitelist","type":{"kind":"simple","type":"bool","optional":false}},{"name":"user_item_limit","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"ProfileData","header":1499272752,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"user","type":{"kind":"simple","type":"address","optional":false}},{"name":"is_whitelisted","type":{"kind":"simple","type":"bool","optional":false}},{"name":"is_blacklisted","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"Transfer","header":1607220500,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"new_owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"response_destination","type":{"kind":"simple","type":"address","optional":true}},{"name":"custom_payload","type":{"kind":"simple","type":"cell","optional":true}},{"name":"forward_amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"forward_payload","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"OwnershipAssigned","header":85167505,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"prev_owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"forward_payload","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"Excesses","header":3576854235,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"GetStaticData","header":801842850,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"ReportStaticData","header":2339837749,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"index_id","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"collection","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"GetNftData","header":null,"fields":[{"name":"is_initialized","type":{"kind":"simple","type":"bool","optional":false}},{"name":"index","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"collection_address","type":{"kind":"simple","type":"address","optional":false}},{"name":"owner_address","type":{"kind":"simple","type":"address","optional":false}},{"name":"individual_content","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"CollectionMasterData","header":null,"fields":[{"name":"master","type":{"kind":"simple","type":"address","optional":false}},{"name":"mint_limit","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"price","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"mint_time_limit","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"is_sbt","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"index_in_collection","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"CollectionMasterDataV2","header":null,"fields":[{"name":"master","type":{"kind":"simple","type":"address","optional":false}},{"name":"mint_limit","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"price","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"mint_time_limit","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"is_sbt","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"index_in_collection","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"enable_whitelist","type":{"kind":"simple","type":"bool","optional":false}},{"name":"user_item_limit","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"MintTo","header":340819044,"fields":[{"name":"owner","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"MassUpdateWhiteList","header":1197680529,"fields":[{"name":"addresses","type":{"kind":"simple","type":"cell","optional":false}},{"name":"add","type":{"kind":"simple","type":"bool","optional":false}},{"name":"spendPerAddress","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"SetupCollectionData","header":562350832,"fields":[{"name":"collection_owner","type":{"kind":"simple","type":"address","optional":true}},{"name":"collection_item_price","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"user_item_limit","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"enable_whitelist","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"CompleteTodo","header":2587315870,"fields":[{"name":"seqno","type":{"kind":"simple","type":"uint","optional":false,"format":256}}]},
    {"name":"InternalComplete","header":3472919628,"fields":[{"name":"excess","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"InternalAdd","header":306259763,"fields":[{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"origin","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"TransferOwner","header":836118768,"fields":[{"name":"new_owner","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"Withdraw","header":1318511648,"fields":[{"name":"to","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"MasterData","header":null,"fields":[{"name":"master","type":{"kind":"simple","type":"address","optional":false}},{"name":"next_collection_index","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"collection_creation_price","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"NftItem$Data","header":null,"fields":[{"name":"collection_address","type":{"kind":"simple","type":"address","optional":false}},{"name":"item_index","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"is_initialized","type":{"kind":"simple","type":"bool","optional":false}},{"name":"owner","type":{"kind":"simple","type":"address","optional":true}},{"name":"individual_content","type":{"kind":"simple","type":"cell","optional":true}}]},
    {"name":"SbtItem$Data","header":null,"fields":[{"name":"collection_address","type":{"kind":"simple","type":"address","optional":false}},{"name":"item_index","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"is_initialized","type":{"kind":"simple","type":"bool","optional":false}},{"name":"owner","type":{"kind":"simple","type":"address","optional":true}},{"name":"individual_content","type":{"kind":"simple","type":"cell","optional":true}}]},
    {"name":"BuyerProfile$Data","header":null,"fields":[{"name":"collection_address","type":{"kind":"simple","type":"address","optional":false}},{"name":"collection_owner","type":{"kind":"simple","type":"address","optional":true}},{"name":"collection_item_price","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"is_initialized","type":{"kind":"simple","type":"bool","optional":false}},{"name":"is_whitelisted","type":{"kind":"simple","type":"bool","optional":false}},{"name":"enable_whitelist","type":{"kind":"simple","type":"bool","optional":false}},{"name":"user_item_limit","type":{"kind":"simple","type":"uint","optional":false,"format":8}},{"name":"user_item_count","type":{"kind":"simple","type":"uint","optional":false,"format":8}}]},
    {"name":"SimpleNftMaster$Data","header":null,"fields":[{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"next_collection_index","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"collection_creation_price","type":{"kind":"simple","type":"uint","optional":false,"format":32}}]},
]

const NftItem_getters: ABIGetter[] = [
    {"name":"get_nft_data","arguments":[],"returnType":{"kind":"simple","type":"GetNftData","optional":false}},
]

export const NftItem_getterMapping: { [key: string]: string } = {
    'get_nft_data': 'getGetNftData',
}

const NftItem_receivers: ABIReceiver[] = [
    {"receiver":"internal","message":{"kind":"typed","type":"Transfer"}},
    {"receiver":"internal","message":{"kind":"typed","type":"GetStaticData"}},
]

export class NftItem implements Contract {
    
    static async init(collection_address: Address, item_index: bigint) {
        return await NftItem_init(collection_address, item_index);
    }
    
    static async fromInit(collection_address: Address, item_index: bigint) {
        const init = await NftItem_init(collection_address, item_index);
        const address = contractAddress(0, init);
        return new NftItem(address, init);
    }
    
    static fromAddress(address: Address) {
        return new NftItem(address);
    }
    
    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        types:  NftItem_types,
        getters: NftItem_getters,
        receivers: NftItem_receivers,
        errors: NftItem_errors,
    };
    
    private constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: Transfer | GetStaticData) {
        
        let body: Cell | null = null;
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Transfer') {
            body = beginCell().store(storeTransfer(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'GetStaticData') {
            body = beginCell().store(storeGetStaticData(message)).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }
        
        await provider.internal(via, { ...args, body: body });
        
    }
    
    async getGetNftData(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('get_nft_data', builder.build())).stack;
        const result = loadGetterTupleGetNftData(source);
        return result;
    }
    
}