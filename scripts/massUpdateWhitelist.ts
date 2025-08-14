import { Address, beginCell, toNano } from '@ton/core';
import { NetworkProvider, sleep } from '@ton/blueprint';
import { NftItem } from '../wrappers/SimpleNftItem';
import { SimpleNftMaster } from '../wrappers/SimpleNftMaster';
import { SimpleNftCollectionV2 } from '../build/SimpleNftMaster/tact_SimpleNftCollectionV2';
import { buildAddressListCell, waitForDeploy } from '../utils/deploy';
import { BuyerProfile } from '../build/SimpleNftMaster/tact_BuyerProfile';
import { makeSnakeAddressCell } from '../utils/cell';
import * as fs from 'fs';
import * as path from 'path';
import { post } from '../utils/api';
import { spendPerWallet } from '../utils/config';

type WalletEntry = {
    address: string;
    mnemonic: string[];
};

export interface WhitelistRefreshData {
    collection: string;
    profiles: string[];
}

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();
    const addresses: Address[] = [];

    while (true) {
        const newAddress = await ui.input('Profile address to add (say n to finish list):');
        if (newAddress.startsWith('read')) {
            const args = newAddress.split(' ');
            const startIndex = parseInt(args[1] || '0', 10);
            const endIndex = parseInt(args[2] || '999', 10);
            const mnemonicsPath = path.resolve(__dirname, '..', 'wallets.json');
            const walletEntries: WalletEntry[] = JSON.parse(fs.readFileSync(mnemonicsPath, 'utf-8'));
            const selectedEntries = walletEntries.slice(startIndex, endIndex + 1);
            addresses.push(
                ...selectedEntries.map((we) => {
                    return Address.parse(we.address);
                }),
            );
        }
        if (newAddress === 'n' || newAddress.startsWith('read')) break;
        try {
            addresses.push(Address.parse(newAddress));
        } catch (e) {
            console.log('Invalid address, skipped');
        }
    }

    const collectionAddress = Address.parse(
        args.length > 0 ? args[0] : await ui.input('Collection adddress (V2 or higher):'),
    );
    const needToSend = await ui.input('Send update transaction?  (y / n)');
    if (needToSend === 'y') {
        const collection = provider.open(SimpleNftCollectionV2.fromAddress(collectionAddress));

        const addressesCell = makeSnakeAddressCell(addresses);

        // Test mass update
        await collection.send(
            provider.sender(),
            {
                value: toNano('2'),
            },
            {
                $$type: 'MassUpdateWhiteList', // strict on Tact ABI
                addresses: addressesCell,
                add: true,
                spendPerAddress: spendPerWallet
            },
        );
        await sleep(30000);
    }
    console.log('Requesting a reindex');
    const notifyUrl = `https://websiteonlytest.ru/api/collection/massupdate`;
    console.log('Notifying backend:', notifyUrl);
    const dataToSend: WhitelistRefreshData = {
        collection: collectionAddress.toString(),
        profiles: addresses.map((a) => a.toString()),
    };
    try {
        const response = await post(notifyUrl, dataToSend, 'POST');
        console.log('✅ Notification sent. Response:', response);
    } catch (notifyErr) {
        console.warn('⚠️ Failed to notify backend:', notifyErr);
    }
    ui.clearActionPrompt();
}
