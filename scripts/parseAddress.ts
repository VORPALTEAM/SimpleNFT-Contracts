import { Address, beginCell, toNano } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';
import { SimpleNftMaster } from '../wrappers/SimpleNftMaster';

export async function run(provider: NetworkProvider) {
    const ui = provider.ui();
    const contractAddress = await ui.input('Contract address:');

    console.log('Parsed address:', Address.parse(contractAddress).toString());
}