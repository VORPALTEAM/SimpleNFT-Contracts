import { Address, toNano } from '@ton/core';
import { NetworkProvider, sleep } from '@ton/blueprint';
import { NftItem } from '../wrappers/SimpleNftItem';
import { SimpleNftCollectionV2 } from '../build/SimpleNftMaster/tact_SimpleNftCollectionV2';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('SimpleNft collection address (V2 with no profile)'));

    if (!(await provider.isContractDeployed(address))) {
        ui.write(`Error: Contract at address ${address} is not deployed!`);
        return;
    }

    const simpleNftCollection = provider.open(SimpleNftCollectionV2.fromAddress(address));

    const dataInfo = await simpleNftCollection.getGetCollectionData();
    let nftAddress = await simpleNftCollection.getGetNftAddressByIndex(2n);

    await simpleNftCollection.send(
        provider.sender(),
        {
            value: toNano('0.039'),
        },
        "Mint"
    );

    let dataInfoAfter = await simpleNftCollection.getGetCollectionData();
    let attempt = 1;

    console.log("Changes: ", dataInfo, dataInfoAfter)

    ui.clearActionPrompt();
    ui.write('Counter increased successfully!');
}
