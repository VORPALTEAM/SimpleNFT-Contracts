import { Address, beginCell, toNano } from '@ton/core';
import { NetworkProvider, sleep } from '@ton/blueprint';
import { NftItem } from '../wrappers/SimpleNftItem';
import { SimpleNftMaster } from '../wrappers/SimpleNftMaster';
import { SimpleNftCollectionV2 } from '../build/SimpleNftMaster/tact_SimpleNftCollectionV2';
import { waitForDeploy } from '../utils/deploy';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();
    const owner = Address.parse("EQBXOYPdhtLTaY3UJ8Cb69k7-nDFMPrR3S9lhWuk3uscesyQ"); // EQASOROUZS1xSjdKIZXzoR59-LRqs48Kc6ZXjTYNKAdQzu7r
    const OFFCHAIN_CONTENT_PREFIX = 0x01;
    const collectionCreationPrice = '0.25';
    const collectionItemPrice = '0.3';
    const string_first = "https://gateway.pinata.cloud/ipfs/QmXpAW9kqXApy6reNfUHXKBuDwVCCq8UG3tkokCgnKSxMd";
    const string_content = "https://gateway.pinata.cloud/ipfs/QmZYpbA6kKXWk85AEEXu8VGgLVE2L166mJzcuFYBokQpXZ";
    const content = beginCell().storeInt(OFFCHAIN_CONTENT_PREFIX, 8).storeBuffer(Buffer.from(string_first)).endCell();
    const nftContent = beginCell().storeInt(OFFCHAIN_CONTENT_PREFIX, 8).storeBuffer(Buffer.from(string_content)).endCell();
    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('SimpleNftMaster address'));
    const myRoyaltyParams = {
        $$type: "RoyaltyParams" as "RoyaltyParams",
        numerator: 100n, // 350n = 35%
        denominator: 1000n,
        destination: owner,
    }
    const newMaster = provider.open(SimpleNftMaster.fromAddress(address));

    if (!(await provider.isContractDeployed(address))) {
        ui.write(`Error: Contract at address ${address} is not deployed!`);
        return;
    }
    const nextIntex = await newMaster.getGetNextCollectionIndex();
    const nextAddress = await newMaster.getGetCollectionAddressByIndex(nextIntex)
    console.log("Building on index: ", nextAddress)
    if (!provider.sender()?.address) {
        console.log("No address")
        return;
    }
    const firstCollectionCreate = await newMaster.send(
        provider.sender(),
        {
            value: toNano(collectionCreationPrice),
        },
        {
            $$type: "CollectionMintParams",
            queryId: 0n, 
            owner_address: provider.sender().address || owner, 
            collection_content: content, 
            nft_individual_content_url: nftContent,
            royalty_params: myRoyaltyParams,
            mint_limit: 100n,
            mint_time_limit: 1900000000n,
            is_sbt: 1n,
            nft_price: toNano(collectionItemPrice),
            enable_profile: true,
            user_item_limit: 1n,
            enable_whitelist: true
        }
    );
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
    ui.write('Counter increased successfully!');
}
