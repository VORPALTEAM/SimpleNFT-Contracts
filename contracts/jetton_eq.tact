import "@stdlib/deploy";
import "./packages/token/jetton/JettonMaster";
import "./packages/token/jetton/JettonWallet";

contract EqJettonWallet with JettonWallet {
    balance: Int as coins = 0;
    owner: Address;
    jetton_master: Address;

    init(owner: Address, jetton_master: Address) {
        self.owner = owner;
        self.jetton_master = jetton_master;
    }

    override inline fun calculate_jetton_wallet_init(owner_address: Address): StateInit {
        return initOf EqJettonWallet(owner_address, self.jetton_master);
    }
}

contract EqJettonMaster with JettonMaster, Deployable {
    total_supply: Int as coins = 0;
    mintable: Bool = true;
    owner: Address;
    jetton_content: Cell;

    // Fixed calculated value
    init(owner: Address, jetton_content: Cell, total_supply: Int){
        let ctx: Context = context();
        self.owner = owner;
        self.total_supply = total_supply;
        self.jetton_content = jetton_content;
        let msg: JettonMint = JettonMint{
            origin: ctx.sender,
            receiver: ctx.sender,
            amount: total_supply,
            custom_payload: emptyCell(),
            forward_ton_amount: 0,
            forward_payload: emptySlice()
        };
        self._mint(ctx, msg);
    }

    /* receive("Mint:1") {
        let ctx: Context = context();
        let msg: JettonMint = JettonMint{
            origin: ctx.sender,
            receiver: ctx.sender,
            amount: ton("1"),
            custom_payload: emptyCell(),
            forward_ton_amount: 0,
            forward_payload: emptySlice()
        };
        self._mint_validate(ctx, msg);
        self._mint(ctx, msg);
    }

    receive("Mint:Grand") {
        let ctx: Context = context();
        let msg: JettonMint = JettonMint{
            origin: ctx.sender,
            receiver: ctx.sender,
            amount: ton("1000"),
            custom_payload: emptyCell(),
            forward_ton_amount: 0,
            forward_payload: emptySlice()
        };
        self._mint(ctx, msg);
    } */

    override inline fun _mint_validate(ctx: Context, msg: JettonMint) {
        require(self.mintable, "JettonMaster: Jetton is not mintable");
    }

    override inline fun calculate_jetton_wallet_init(owner_address: Address): StateInit {
        return initOf EqJettonWallet(owner_address, myAddress());
    }


}