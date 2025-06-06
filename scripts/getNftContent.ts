import { Address, toNano } from '@ton/core';
import { SimpleNftCollectionV2 } from '../build/SimpleNftMaster/tact_SimpleNftCollectionV2';
import { NetworkProvider, sleep } from '@ton/blueprint';
import { NftItem } from '../wrappers/SimpleNftItem';

function hexToString(hex: string): string {
    // Remove any '0x' prefix if it exists
    if (hex.startsWith('0x')) {
        hex = hex.slice(2);
    }

    // Convert hex to string
    let str = '';
    for (let i = 0; i < hex.length; i += 2) {
        const hexCode = hex.substring(i, i + 2);
        str += String.fromCharCode(parseInt(hexCode, 16));
    }
    return str;
}

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('Collection address'));

    if (!(await provider.isContractDeployed(address))) {
        ui.write(`Error: Contract at address ${address} is not deployed!`);
        return;
    }

    const simpleNftCollection = provider.open(SimpleNftCollectionV2.fromAddress(address));
    try {

        const sampleNft = await simpleNftCollection.getGetSampleNftContent();
        console.log("Decrypted sample: ", hexToString(String(sampleNft)));
    } catch (e) {
       console.log("Collection with no this method")
    }
    const dataInfo = await simpleNftCollection.getGetCollectionData();
    const masterInfo = await simpleNftCollection.getGetMasterData();
    let nftAddress = await simpleNftCollection.getGetNftAddressByIndex(1n);
    console.log("Found address: ", nftAddress, "Data: ", dataInfo, "Master:", masterInfo);

    /* await simpleNftCollection.send(
        provider.sender(),
        {
            value: toNano('1.5'),
        },
        "Mint"
    ); */
    console.log("Decrypted collection: ", hexToString(String(dataInfo.collection_content)));
    if (nftAddress) {
        const simpleNftITem = provider.open(NftItem.fromAddress(nftAddress));
        const nftData = await simpleNftITem.getGetNftData();
        console.log("Individual data: ", nftData);
        console.log("Decrypted nft: ", hexToString(String(nftData.individual_content)));
    } else {
        console.log("Where is address?");
    }

    let dataInfoAfter = await simpleNftCollection.getGetCollectionData();
    let attempt = 1;

    console.log("Changes: ", dataInfo, dataInfoAfter)

    ui.clearActionPrompt();
    ui.write('Completed!');
}
