import { mnemonicNew, mnemonicToPrivateKey } from '@ton/crypto';
import { keyPairFromSeed } from '@ton/crypto';
import { WalletContractV4 } from '@ton/ton';
import { Address } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';
import * as fs from 'fs';
import * as path from 'path';

export async function run(provider: NetworkProvider) {
    const ui = provider.ui();
    const countStr = await ui.input('How many wallets to generate?');
    const count = parseInt(countStr);

    if (isNaN(count) || count <= 0) {
        console.log('Invalid count');
        return;
    }

    const lines: string[] = [];

    for (let i = 0; i < count; i++) {
        const mnemonic = await mnemonicNew(24);
        const key = await mnemonicToPrivateKey(mnemonic);

        const wallet = WalletContractV4.create({
            workchain: 0,
            publicKey: key.publicKey,
        });

        const address = wallet.address.toString();
        const phrase = mnemonic.join(' ');

        console.log(`\nWallet #${i + 1}`);
        console.log('Address:', address);
        console.log('Mnemonic:', phrase);

        lines.push(`Wallet #${i + 1}`);
        lines.push(`Address: ${address}`);
        lines.push(`Mnemonic: ${phrase}`);
        lines.push(''); // blank line
    }

    // Сохраняем в wallets.txt в директории скрипта
    const filePath = path.resolve(__dirname, 'wallets.txt');
    fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');

    console.log(`\n✅ Saved ${count} wallets to ${filePath}`);
}
