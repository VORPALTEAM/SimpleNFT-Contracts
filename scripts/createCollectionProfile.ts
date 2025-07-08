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
    const buyerProfile = await collection.getGetBuyerProfileAddress(user);
    console.log('Profile:', buyerProfile);

    console.log('Sending...');
    await collection.send(
        provider.sender(),
        {
            value: toNano('0.025'),
        },
        'RequestWhitelist', // "Mint" // "RequestWhitelist"
    );

    const deployResult = await waitForDeploy(provider, buyerProfile);

    if (!deployResult) {
        console.log('Not deployed per timeout!');
        return;
    }

    ui.clearActionPrompt();
}
