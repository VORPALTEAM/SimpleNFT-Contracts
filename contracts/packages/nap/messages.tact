message WithdrawMessage {
    amount: Int as coins;
    receiver: Address;
}

message SetFees {
    newNapFee: Int as coins;
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