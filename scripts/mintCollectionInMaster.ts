import { Address, beginCell, toNano } from '@ton/core';
import { SimpleNftCollection } from '../wrappers/SimpleNftCollection';
import { NetworkProvider, sleep } from '@ton/blueprint';
import { NftItem } from '../wrappers/SimpleNftItem';
import { SimpleNftMaster } from '../wrappers/SimpleNftMaster';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();
    const owner = Address.parse("EQBXOYPdhtLTaY3UJ8Cb69k7-nDFMPrR3S9lhWuk3uscesyQ");
    const OFFCHAIN_CONTENT_PREFIX = 0x01;
    const string_first = "https://s.getgems.io/nft/c/66eb584daac141e834f514c1/meta.json";
    const string_content = "https://s.getgems.io/nft/c/66eb584daac141e834f514c1/1/meta.json";
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
            value: toNano('0.5'),
        },
        {
            $$type: "CollectionMintParams",
            queryId: 0n, 
            owner_address: provider.sender().address || owner, 
            collection_content: content, 
            nft_individual_content_url: nftContent,
            royalty_params: myRoyaltyParams,
            mint_limit: 0n,
            nft_price: toNano("1.1")
        }
    );
    if (!nextAddress) {
        return;
    }
    
    const simpleNftCollection = provider.open(SimpleNftCollection.fromAddress(nextAddress));

    const dataInfo = await simpleNftCollection.getGetCollectionData();
    let nftAddress = await simpleNftCollection.getGetNftAddressByIndex(2n);

    await simpleNftCollection.send(
        provider.sender(),
        {
            value: toNano('1.1'),
        },
        "Mint"
    );

    let dataInfoAfter = await simpleNftCollection.getGetCollectionData();
    let attempt = 1;

    console.log("Changes: ", dataInfo, dataInfoAfter)

    ui.clearActionPrompt();
    ui.write('Counter increased successfully!');
}
