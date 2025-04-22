import { Address, toNano } from '@ton/core';
import { EqJettonWallet } from '../wrappers/JettonMaster';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const parent = Address.parse(args.length > 0 ? args[0] : await ui.input('Master address'));
    const owner = Address.parse(args.length > 0 ? args[2] : await ui.input('Owner address'));
    const jettonWallet = provider.open(await JettonWallet.fromInit(parent, owner));

    await jettonWallet.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(jettonWallet.address);

    // run methods on `jettonWallet`
}
