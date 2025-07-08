import { Address, beginCell, toNano } from '@ton/core';
import { NetworkProvider, sleep } from '@ton/blueprint';
import { NftItem } from '../wrappers/SimpleNftItem';
import { SimpleNftMaster } from '../wrappers/SimpleNftMaster';
import { SimpleNftCollectionV2 } from '../build/SimpleNftMaster/tact_SimpleNftCollectionV2';
import { buildAddressListCell, waitForDeploy } from '../utils/deploy';
import { BuyerProfile } from '../build/SimpleNftMaster/tact_BuyerProfile';
import { makeSnakeAddressCell } from '../utils/cell';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();
    const addresses: Address[] = [];

    while (true) {
        const newAddress = await ui.input('Profile address to add (say n to finish list):');
        if (newAddress === "n") break;
        try {
            addresses.push(Address.parse(newAddress));
        } catch (e) {
            console.log("Invalid address, skipped")
        }
    }

    const collectionAddress = Address.parse(
        args.length > 0 ? args[0] : await ui.input('Collection adddress (V2 or higher):'),
    );

    const collection = provider.open(SimpleNftCollectionV2.fromAddress(collectionAddress));

    const addressesCell = makeSnakeAddressCell(addresses);

      // Test mass update
       await collection.send(
        provider.sender(),
        {
            value: toNano('0.5'),
        },
        {
            $$type: 'MassUpdateWhiteList', // strict on Tact ABI
            addresses: addressesCell,
            add: true,
        },
      );


    ui.clearActionPrompt();
}
