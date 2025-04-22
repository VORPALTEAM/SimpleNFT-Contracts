import { Address, toNano } from '@ton/core';
import { EqJettonMaster } from '../wrappers/JettonMaster';
import { NetworkProvider } from '@ton/blueprint';
import { buildJettonContent } from '../utils/ton-tep64';

export async function run(provider: NetworkProvider) {


    // Content example:
    /* {
       "name": "Hamster Kombat",
       "description": "Unleash your inner CEO",
       "symbol": "HMSTR",
       "decimals": "9",
       "image": "https://token.hamsterkombatgame.io/token/icon.png",
       "mintles_merkle_dump_uri": "",
       "custom_payload_api_uri":"https://proof.hamsterkombatgame.io/jettons/EQAJ8uWd7EBqsmpSWaRdf_I-8R8-XHwh3gsNKhy-UrdrPcUo/"
    } */
     const jettonContent = buildJettonContent({
        name: 'Unicorns1',
        description: 'Unicorns are just horses who believed in glitter and themselves!',
        symbol: 'UNI',
       decimals: '9',
        image: 'https://thumbs.dreamstime.com/b/unicorn-sitting-cloud-red-balloon-balloon-tied-to-unicorn-s-mouth-image-has-whimsical-321806797.jpg',
    });
    const owner = Address.parse("EQASOROUZS1xSjdKIZXzoR59-LRqs48Kc6ZXjTYNKAdQzu7r");
    
    const jettonMaster = provider.open(await EqJettonMaster.fromInit(owner, jettonContent, toNano('1000')));

    await jettonMaster.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(jettonMaster.address);

    // run methods on `jettonMaster`
}