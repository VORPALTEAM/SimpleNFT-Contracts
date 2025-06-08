import { Address, beginCell, toNano } from '@ton/core';
import { SimpleNftMaster } from '../wrappers/SimpleNftMaster';
import { NetworkProvider, sleep } from '@ton/blueprint';
import { buildAddressListCell, waitForDeploy } from '../utils/deploy';
import { SimpleNftCollectionV2 } from '../build/SimpleNftMaster/tact_SimpleNftCollectionV2';
import { BuyerProfile } from '../build/SimpleNftMaster/tact_BuyerProfile';

export async function run(provider: NetworkProvider) {
    const ui = provider.ui();
    const owner = Address.parse(await ui.input('Owner address:'));
    const simpleNftMaster = provider.open(await SimpleNftMaster.fromInit(
         owner,
         toNano("0.25")
    ));
    const myRoyaltyParams = {
        $$type: "RoyaltyParams" as "RoyaltyParams",
        numerator: 100n, // 350n = 35%
        denominator: 1000n,
        destination: owner,
    }
    await simpleNftMaster.send(
        provider.sender(),
        {
            value: toNano('0.5'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(simpleNftMaster.address);

    const collectionAddress = await simpleNftMaster.getGetCollectionAddressByIndex(0n);

    console.log('Data', await simpleNftMaster.getGetMasterData());
    console.log("First collection will be:", collectionAddress);
    console.log('Address of the first collection: ', await simpleNftMaster.getGetCollectionAddressByIndex(0n));


    const OFFCHAIN_CONTENT_PREFIX = 0x01;
    const collectionCreationPrice = '0.25';
    const collectionItemPrice = '0.05';
    const string_first = "https://gateway.pinata.cloud/ipfs/QmXpAW9kqXApy6reNfUHXKBuDwVCCq8UG3tkokCgnKSxMd";
    const string_content = "https://gateway.pinata.cloud/ipfs/QmZYpbA6kKXWk85AEEXu8VGgLVE2L166mJzcuFYBokQpXZ";
    const content = beginCell().storeInt(OFFCHAIN_CONTENT_PREFIX, 8).storeBuffer(Buffer.from(string_first)).endCell();
    const nftContent = beginCell().storeInt(OFFCHAIN_CONTENT_PREFIX, 8).storeBuffer(Buffer.from(string_content)).endCell();
    
    const newMaster = provider.open(simpleNftMaster);

    if (!(await provider.isContractDeployed(newMaster.address))) {
        ui.write(`Error: Contract at address ${newMaster.address} is not deployed!`);
        return;
    }
    const nextColIndex = await simpleNftMaster.getGetNextCollectionIndex();
    const nextAddress = await simpleNftMaster.getGetCollectionAddressByIndex(nextColIndex)
    console.log("Collection index: ", nextColIndex)
    console.log("Building on index: ", nextAddress)
    if (!provider.sender()?.address) {
        console.log("No address")
        return;
    }
    await simpleNftMaster.send(
        provider.sender(),
        {
            value: toNano(collectionCreationPrice),
        },
        {
            $$type: "CollectionMintParams",
            queryId: 0n, 
            owner_address: owner, 
            collection_content: content, 
            nft_individual_content_url: nftContent,
            royalty_params: myRoyaltyParams,
            mint_limit: 100n,
            mint_time_limit: 1900000000n,
            is_sbt: 1n,
            nft_price: toNano(collectionItemPrice),
            enable_profile: true,
            user_item_limit: 2n,
            enable_whitelist: true
        }
    );
    console.log("Collection mint sent");
    if (!nextAddress) {
        return;
    }

    const deployResult = await waitForDeploy (provider, nextAddress);

    if (!deployResult) {
        console.log("Not deployed per timeout!");
        return;
    }
    
    const simpleNftCollection = provider.open(SimpleNftCollectionV2.fromAddress(nextAddress));
    const awaitingResult = await provider.isContractDeployed(nextAddress);
    console.log("Deploy detected:", awaitingResult);
    /* if (!(await provider.isContractDeployed(nextAddress))) {
        ui.write(`Error: Collection is not deployed!`);
        return;
    } */
    const dataInfo = await simpleNftCollection.getGetCollectionData();
    let nftAddress = await simpleNftCollection.getGetNftAddressByIndex(2n);

    const todoAddress = await simpleNftCollection.getBuyerProfileAddress(owner);


    console.log("Address to do:", todoAddress)

    /* await simpleNftCollection.send(
        provider.sender(),
        {
            value: toNano(collectionItemPrice),
        },
        "RequestWhitelist" // "Mint" // "RequestWhitelist"
    ); */

    let dataInfoAfter = await simpleNftCollection.getGetCollectionData();
    let attempt = 1;

    console.log("Changes: ", dataInfo, dataInfoAfter);
    const senderProfile = await simpleNftCollection.getGetBuyerProfileAddress(owner);
    console.log("Profile addres will be: ", senderProfile);
    ui.clearActionPrompt();
    ui.write('Mint profile and nft started:');

        if (!owner) {
            console.log('User address missed');
            return;
        }
        console.log('User address:', owner);
        // Get profile address
        const collectionData = await simpleNftCollection.getGetCollectionData();
        console.log('Collection data:', collectionData);
        const masterData = await simpleNftCollection.getGetMasterData();
        console.log('Master data:', masterData);
        // Create profile
        const buyerProfile = await simpleNftCollection.getGetBuyerProfileAddress(owner);
        console.log('Profile:', buyerProfile, 'Sending...');
        await simpleNftCollection.send(
            provider.sender(),
            {
                value: toNano('0.02'),
            },
            'RequestWhitelist', // "Mint" // "RequestWhitelist"
        );
    
        const deployResultProfile = await waitForDeploy(provider, buyerProfile);
    
        if (!deployResultProfile) {
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
    
        const addressesCell = buildAddressListCell([owner]);
    
        // Test mass update
        await simpleNftCollection.send(
            provider.sender(),
            {
                value: toNano('0.1'),
            },
            {
                $$type: 'MassUpdateWhiteList', // Tact ABI, strict
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
        const nextIndex = await simpleNftCollection.getGetNftAddressByIndex(collectionData.next_item_index);
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