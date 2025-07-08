import { Address, beginCell, toNano } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';
import { SimpleNftMaster } from '../wrappers/SimpleNftMaster';
import * as fs from 'fs';
import * as path from 'path';
import { WalletContractV4, internal } from '@ton/ton';
import { mnemonicToPrivateKey } from '@ton/crypto';

type Wallet = {
    address: string;
    mnemonic: string[];
};

export async function run(provider: NetworkProvider) {
    // Mass ton sending
    const sender = provider.sender();
    const senderAddress = sender.address?.toString() ?? '(unknown)';
    const ui = provider.ui();

    const walletsFilePath = path.resolve(__dirname, '../wallets.json');

    function readWallets(): Wallet[] {
        const fileContent = fs.readFileSync(walletsFilePath, 'utf-8');
        const wallets: Wallet[] = JSON.parse(fileContent);
        return wallets;
    }

    const wallets = readWallets();

    ui.write(`Send 2 TON from (${senderAddress}) to ${wallets.length} addresses...\n`);

    for (const [i, wallet] of wallets.entries()) {
        ui.write(`Processing wallet #${i + 1}: ${wallet.address}\n`);

        // Restore wallet keys from mnemonic phrase
        const keyPair = await mnemonicToPrivateKey(wallet.mnemonic);

        // Create wallet contract instance
        const walletContract = WalletContractV4.create({
            workchain: 0,
            publicKey: keyPair.publicKey,
        });

        // Get the on-chain address of the wallet contract
        const walletAddress = walletContract.address;
        const isDeployed = await provider.isContractDeployed(walletAddress);
        const stateInit = isDeployed ? null : walletContract.init;
        if (!isDeployed) {
            ui.write(`Wallet is not deployed, activating it first...\n`);

            // Create deployment message

            // Send deployment transaction
            await sender.send({
                to: walletAddress,
                value: toNano('2'),
                bounce: false,
                init: isDeployed ? undefined : walletContract.init, // Активирует кошелек, если не активен
            });

            // Wait a bit for deployment to complete
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Verify deployment
            const isNowDeployed = await provider.isContractDeployed(walletAddress);
            if (!isNowDeployed) {
                ui.write(`❌ Failed to deploy wallet ${walletAddress.toString()}, skipping...\n`);
                continue;
            }
        }

        // After wallet activation, send 2 TON to the wallet
        ui.write(`Sending 2 TON to ${walletAddress.toString()}...\n`);
        await sender.send({
            to: walletAddress,
            value: toNano('2'),
        });

        ui.write(`Done for wallet #${i + 1}\n\n`);
    }

    ui.write('🎉 Completed.\n');
}
