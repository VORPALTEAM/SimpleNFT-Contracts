import { Address, toNano } from '@ton/core';
import { SimpleNftCollection } from '../build/SimpleNftMaster/tact_SimpleNftCollection';
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
    const transferTo = "0QB3EKxsv3mtBLsTSfam5daBjki9Z4CKovFRggriYssxor5_";
    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('Nft address'));
    const to = Address.parse(transferTo);

    if (!(await provider.isContractDeployed(address))) {
        ui.write(`Error: Contract at address ${address} is not deployed!`);
        return;
    }

    const simpleNftITem = provider.open(NftItem.fromAddress(address));
    const nftData = await simpleNftITem.getGetNftData();
    console.log("Individual data: ", nftData);
    console.log("Decrypted nft: ", hexToString(String(nftData.individual_content)));

    await simpleNftITem.send(
        provider.sender(),
    {
        value: toNano('0.1'), // Общая сумма, отправляемая в контракт (0.1 TON)
        bounce: true, // Нужно ли возвращать средства при ошибке
    }, {
        $$type: "Transfer", 
        query_id: 1n, 
        new_owner: to, 
        response_destination: address,
        custom_payload, 
        forward_amount, 
        forward_payload
    });
    
    ui.clearActionPrompt();
    ui.write('Completed!');
}
