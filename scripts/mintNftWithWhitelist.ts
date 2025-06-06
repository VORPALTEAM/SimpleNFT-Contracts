import { Address, beginCell, toNano } from '@ton/core';
import { NetworkProvider, sleep } from '@ton/blueprint';
import { NftItem } from '../wrappers/SimpleNftItem';
import { SimpleNftMaster } from '../wrappers/SimpleNftMaster';
import { SimpleNftCollectionV2 } from '../build/SimpleNftMaster/tact_SimpleNftCollectionV2';
import { buildAddressListCell, waitForDeploy } from '../utils/deploy';
import { BuyerProfile } from '../build/SimpleNftMaster/tact_BuyerProfile';

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
    console.log('Profile:', buyerProfile, 'Sending...');
    await collection.send(
        provider.sender(),
        {
            value: toNano('0.02'),
        },
        'RequestWhitelist', // "Mint" // "RequestWhitelist"
    );

    const deployResult = await waitForDeploy(provider, buyerProfile);

    if (!deployResult) {
        console.log('Not deployed per timeout!');
        return;
    }
    // Add to white list
    const profile = provider.open(BuyerProfile.fromAddress(buyerProfile));
    /* await collection.send(
         provider.sender(),    
        {
            value: toNano("0.1"),
        }, 
        {
            $$type: "UpdateWhiteList",
            user: user,
            whitelist: true
        }  
    ); */

    const addressesCell = buildAddressListCell([user]);

    // Test mass update
    await collection.send(
        provider.sender(),
        {
            value: toNano('0.1'),
        },
        {
            $$type: 'MassUpdateWhiteList', // строго по Tact ABI
            addresses: addressesCell,
            add: true,
        },
    );

    await sleep(30000);
    const profileState = await profile.getIsWhitelisted();
    console.log('Is whitelisted:', profileState);
    if (!profileState) {
        console.log("White list addition failed, stopping...");
        return;
    }
    // Mint nft via profile
    const nextIndex = await collection.getGetNftAddressByIndex(collectionData.next_item_index);
    console.log('Will nft address:', nextIndex);
    if (!nextIndex) return;
    await profile.send(
        provider.sender(),
        {
            value: masterData.price,
        },
        'Mint',
    );
    console.log('Wait for deploy');

    const deployResultNft = await waitForDeploy(provider, nextIndex);
    if (!deployResultNft) {
        console.log('Not deployed per timeout!');
        return;
    }

    ui.clearActionPrompt();
    ui.write('Counter increased successfully!');
}
