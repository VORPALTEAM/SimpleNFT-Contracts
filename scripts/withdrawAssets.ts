import { Address, beginCell, toNano } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';
import { SimpleNftMaster } from '../wrappers/SimpleNftMaster';

export async function run(provider: NetworkProvider) {
    const ui = provider.ui();
    const contractAddress = await ui.input('Contract address:');
    const to = await ui.input('To address:');

    const contract = provider.open(SimpleNftMaster.fromAddress(Address.parse(contractAddress)));
    console.log('Try to send txn:');
    try {
        await contract.send(
            provider.sender(),
            {
                value: toNano('0.2'),
            },
            {
                $$type: 'Withdraw',
                to: Address.parse(to),
            },
        );
        console.log('Transaction sent successfully');
    } catch (err) {
        console.error('Failed to send transaction:', err);
    }

    const newData = await contract.getGetMasterData();
    console.log('Updated data:', newData);
}
