message TransferJettonDistributor {
    tokenJettonAddress: Address;
    tokenJettonAmount: Int as coins;
}

message JettonBurnDistributor {
    tokenJettonAddress: Address;
    tokenJettonAmount: Int as coins;
}

message(0x595f07bc) JettonBurn {
    queryId: Int as uint64;
    amount: Int as coins;
    responseDestination: Address?;
    customPayload: Cell? = null;
}

message NativeSwapDistributor {
    poolAddress: Address;
    amount: Int as coins;
    limit: Int as coins;
}

message(0xea06185d) NativeSwap {
    // Unique identifier used to trace transactions across multiple contracts
    // Defaults to 0, which means we don't mark messages to trace their chains
    queryId: Int as uint64 = 0;

    // Toncoin amount for the swap
    amount: Int as coins;

    // Inlined fields of SwapStep Struct
    poolAddress: Address;
    kind: Int as uint1 = 0;
    limit: Int as coins = 0;
    nextStep: SwapStep? = null;

    // Set of parameters relevant for the whole swap
    swapParams: SwapParams;
}

message JettonSwapDistributor{
    poolAddress: Address;
    vaultAddress: Address;
    tokenJettonAddress: Address;
    tokenJettonAmount: Int as coins;
    limit: Int as coins;
}

message(0xe3a0d482) JettonSwapPayload {
    // Inlined fields of SwapStep Struct
    poolAddress: Address;
    kind: Int as uint1 = 0;
    limit: Int as coins = 0;
    nextStep: SwapStep? = null;

    // Set of parameters relevant for the whole swap
    swapParams: SwapParams;
}

struct SwapStep {
    poolAddress: Address;
    kind: Int as uint1 = 0;
    limit: Int as coins = 0;
    nextStep: Cell?;
}

struct SwapParams {
    deadline: Int as uint32 = 0;
    recipientAddress: Address? = null;
    referralAddress: Address? = null;
    fulfillPayload: Cell? = null;
    rejectPayload: Cell? = null;
}

message JettonProvideLiquidityDistributor {
    poolAddress: Address;
    tokenAJettonAddress: Address;
    tokenBJettonAddress: Address;
    tokenAJettonAmount: Int as coins;
    tokenBJettonAmount: Int as coins;
    minimalLpAmount: Int as coins;
}

/// https://docs.dedust.io/reference/tlb-schemes#message-deposit_liquidity-1
message(0x40e108d6) JettonDepositLiquidity {
    // Pool type: 0 for volatile, 1 for stable
    // Volatile pool is based on the "Constant Product" formula
    // Stable-swap pool is optimized for assets of near-equal value,
    // e.g. USDT/USDC, TON/stTON, etc.
    poolType: Int as uint1;

    // Provided assets
    asset0: Asset;
    asset1: Asset;

    // Minimal amount of LP tokens to be received
    // If there's less liquidity provided, the provisioning will be rejected
    // Defaults to 0, makes this value ignored
    minimalLpAmount: Int as coins = 0;

    // Target amount of the first asset
    targetBalances0: Int as coins;

    // Target amount of the second asset
    targetBalances1: Int as coins;

    // Custom payload attached to the transaction if the provisioning is successful
    // Defaults to `null`, which means no payload
    fulfillPayload: Cell? = null;

    // Custom payload attached to the transaction if the provisioning is rejected
    // Defaults to `null`, which means no payload
    rejectPayload: Cell? = null;
}

message NativeProvideLiquidityDistributor {
    jettonWalletAddress: Address;
    jettonMasterAddress: Address;
    jettonAmount: Int as coins;
    nativeAmount: Int as coins;
    minimalLpAmount: Int as coins;
    vaultAddress: Address;
}

/// https://docs.dedust.io/reference/tlb-schemes#message-deposit_liquidity
message(0xd55e4686) NativeDepositLiquidity {
    // Unique identifier used to trace transactions across multiple contracts
    // Defaults to 0, which means we don't mark messages to trace their chains
    queryId: Int as uint64 = 0;

    // Toncoin amount for the deposit
    amount: Int as coins;

    // Inlined fields of JettonDepositLiquidity Message without the opcode prefix
    poolType: Int as uint1;
    asset0: Asset;
    asset1: Asset;
    minimalLpAmount: Int as coins = 0;
    targetBalances0: Int as coins;
    targetBalances1: Int as coins;
    fulfillPayload: Cell? = null;
    rejectPayload: Cell? = null;
}

/// https://docs.dedust.io/reference/tlb-schemes#asset
struct Asset {
    // Specify 0 for native (TON) and omit all following fields
    // Specify 1 for Jetton and then you must set non-null values for the following fields
    type: Int as uint4;

    workchain: Int as uint8 = 0; // Both this zeroes will be removed during .build() function. Only type will remain.
    address: Int as uint256 = 0;
}