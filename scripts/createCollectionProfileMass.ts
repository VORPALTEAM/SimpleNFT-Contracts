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
import fetch from 'node-fetch';
import { mnemonicToPrivateKey } from '@ton/crypto';
import { WalletContractV4 } from '@ton/ton';
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
    const passedAddresses: string[] = [];
    const failedAddresses: string[] = [];

    const collectionAddress = Address.parse(
        args.length > 0 ? args[0] : await ui.input('Collection adddress (V2 or higher):'),
    );

    const collection = provider.open(SimpleNftCollectionV2.fromAddress(collectionAddress));
    const user = provider.sender()?.address;
    if (!user) {
        console.log('User address missed');
        return;
    }
    console.log('User address:', user);
    // Get profile address
    const collectionData = await collection.getGetCollectionData();
    console.log('Collection data:', collectionData);
    const masterData = await collection.getGetMasterData();
    console.log('Master data:', masterData);
    // Create profile
    const mnemonicsPath = path.resolve(__dirname, '..', 'wallets.json');
    const walletEntries: WalletEntry[] = JSON.parse(fs.readFileSync(mnemonicsPath, 'utf-8'));

    for (const entry of walletEntries) {
        try {
            const { mnemonic, address } = entry;
            const keyPair = await mnemonicToPrivateKey(mnemonic);

            const wallet = provider.open(
                WalletContractV4.create({
                    workchain: 0,
                    publicKey: keyPair.publicKey,
                }),
            );

            const walletAddr = wallet.address;
            console.log('\nExpected address:', address);
            console.log('Resolved wallet address:', walletAddr.toString());

            if (walletAddr.toString() !== address) {
                console.warn('⚠️ Address mismatch! Skipping this wallet.');
                continue;
            }

            // Получаем адрес профиля
            const profile = await collection.getGetBuyerProfileAddress(walletAddr);
            console.log('Buyer profile address:', profile.toString());

            // Отправляем запрос на беллист
            console.log('Sending whitelist request...');
            await collection.send(
                wallet.sender(keyPair.secretKey),
                {
                    value: toNano('0.025'),
                },
                'RequestWhitelist',
            );

            // Ждём деплой профиля
            const deployed = await waitForDeploy(provider, profile, 9);
            if (!deployed) {
                console.warn('⏱ Timeout waiting for profile deploy:', profile.toString());
                failedAddresses.push(walletAddr.toString())
            } else {
                console.log('✅ Profile deployed successfully!');
                const notifyUrl = `https://websiteonlytest.ru/api/profile/${walletAddr.toString()}/${collectionAddress.toString()}`;
                console.log('Notifying backend:', notifyUrl);
                passedAddresses.push(walletAddr.toString())
                try {
                    const response = await fetch(notifyUrl, { method: 'GET' });
                    const text = await response.text();
                    console.log('✅ Notification sent. Response:', text);
                } catch (notifyErr) {
                    console.warn('⚠️ Failed to notify backend:', notifyErr);
                }
            }

            // Пауза между запросами
            await sleep(100);
        } catch (err) {
            console.error('❌ Error with wallet entry:', err);
        }
    }
    console.log("Added:", passedAddresses.length, "Failed:", failedAddresses.length);
    const whitelistPermanently = await ui.input('Add all to whitelist? (y / n)');
    if (whitelistPermanently === 'y') {
      const addressesCell = makeSnakeAddressCell(passedAddresses.map(a => Address.parse(a)));

      // Test mass update
      await collection.send(
        provider.sender(),
        {
            value: toNano('1'),
        },
        {
            $$type: 'MassUpdateWhiteList', // strict on Tact ABI
            addresses: addressesCell,
            add: true,
            spendPerAddress: spendPerWallet
        },
      );
      await sleep(30000);
      console.log("Requesting a reindex");
      const notifyUrl = `https://websiteonlytest.ru/api/collection/massupdate`;
      console.log('Notifying backend:', notifyUrl);
      const dataToSend: WhitelistRefreshData = {
        collection: collectionAddress.toString(), 
        profiles: passedAddresses
      }
      try {
          const response = await post(notifyUrl, dataToSend, "POST");
          console.log('✅ Notification sent. Response:', response);
      } catch (notifyErr) {
          console.warn('⚠️ Failed to notify backend:', notifyErr);
      }
    }
    ui.clearActionPrompt();
}
