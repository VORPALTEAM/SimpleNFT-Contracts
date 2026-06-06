
const codeUnauthorized: Int = 51003;

// SetStaticTax is the message that used to set the static tax fee.
message(0x1509a420) SetStaticTax {
    staticTax: Int as coins;
}

trait Taxable {
    owner: Address;
    staticTax: Int;

    receive(msg: SetStaticTax) {
        self.receiveSetStaticTax(msg);
    }

    get fun staticTax(): Int {
        return self.staticTax;
    }

    virtual fun receiveSetStaticTax(msg: SetStaticTax) {
        nativeThrowUnless(codeUnauthorized, sender() == self.owner);

        self.staticTax = msg.staticTax;
        let answer = beginString()
            .concat("set static tax fee to ")
            .concat(msg.staticTax.toString())
            .toString();
        self.reply(answer.asComment());
    }
}