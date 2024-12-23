import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Address, beginCell, toNano } from '@ton/core';
import { SimpleNftCollection } from '../wrappers/SimpleNftCollection';
import '@ton/test-utils';
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

describe('SimpleNftCollection', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let simpleNftCollection: SandboxContract<SimpleNftCollection>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        const OFFCHAIN_CONTENT_PREFIX = 0x01;
        const string_first = "https://s.getgems.io/nft/c/66eb584daac141e834f514c1/meta.json";
        const string_content = "https://s.getgems.io/nft/c/66eb584daac141e834f514c1/1/meta.json";
        const content = beginCell().storeInt(OFFCHAIN_CONTENT_PREFIX, 8).storeBuffer(Buffer.from(string_first)).endCell();
        const nftContent = beginCell().storeInt(OFFCHAIN_CONTENT_PREFIX, 8).storeBuffer(Buffer.from(string_content)).endCell();
        deployer = await blockchain.treasury('deployer');
        const owner = Address.parse("EQBXOYPdhtLTaY3UJ8Cb69k7-nDFMPrR3S9lhWuk3uscesyQ");
        const master = deployer.getSender().address; // Address.parse("EQBXOYPdhtLTaY3UJ8Cb69k7-nDFMPrR3S9lhWuk3uscesyQ"); // "UQASOROUZS1xSjdKIZXzoR59-LRqs48Kc6ZXjTYNKAdQzrMu"
        const myRoyaltyParams = {
            $$type: "RoyaltyParams" as "RoyaltyParams",
            numerator: 100n, // 350n = 35%
            denominator: 1000n,
            destination: owner,
        }

        simpleNftCollection = blockchain.openContract(await SimpleNftCollection.fromInit(
            master,
            0n
        ));


        const deployResult = await simpleNftCollection.send(
            deployer.getSender(),
            {
                value: toNano('0.5'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        const send = await simpleNftCollection.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            }, {
                $$type:"CollectionSetupParams",
                owner_address: owner, 
                master_address: master, 
                collection_content: content, 
                royalty_params: myRoyaltyParams,
                nft_individual_content_url: nftContent,
                mint_limit: 0n,
                nft_price: toNano("0.3")
            }
        )

        const dataInfo = await simpleNftCollection.getGetCollectionData();
        let nftAddress = await simpleNftCollection.getGetNftAddressByIndex(0n);

        await simpleNftCollection.send(
           deployer.getSender(),
           {
               value: toNano('0.3'),
            },
            "Mint"
        );

       let dataInfoAfter = await simpleNftCollection.getGetCollectionData();
       let attempt = 1;

       if (nftAddress) {
        const simpleNftITem = blockchain.openContract(NftItem.fromAddress(nftAddress));
        const nftData = await simpleNftITem.getGetNftData();
        console.log("Individual data: ", nftData);
        console.log("Decrypted nft: ", hexToString(String(nftData.individual_content)));
        console.log("Decrypted collection: ", hexToString(String(dataInfo.collection_content)));
    } else {
        console.log("Where is address?");
    }


       console.log("Changes: ", dataInfo, dataInfoAfter)

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: simpleNftCollection.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and simpleNftCollection are ready to use
    });


});
