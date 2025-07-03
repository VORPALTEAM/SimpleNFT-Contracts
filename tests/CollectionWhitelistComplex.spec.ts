import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Address, beginCell, toNano } from '@ton/core';
import { SimpleNftMaster } from '../wrappers/SimpleNftMaster';
import '@ton/test-utils';
import { SimpleNftCollectionV2 } from '../build/SimpleNftMaster/tact_SimpleNftCollectionV2';
import { NftItem } from '../wrappers/SimpleNftItem';
import { makeSnakeAddressCell, readSnakeAddressCell } from '../utils/cell';
import { BuyerProfile } from '../build/SimpleNftMaster/tact_BuyerProfile';
import { buildAddressListCell, waitForDeploy } from '../utils/deploy';

describe('SimpleNftMaster', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let simpleNftMaster: SandboxContract<SimpleNftMaster>;

    const owner = Address.parse('EQBXOYPdhtLTaY3UJ8Cb69k7-nDFMPrR3S9lhWuk3uscesyQ');
    const OFFCHAIN_CONTENT_PREFIX = 0x01;
    const string_first = 'https://gateway.pinata.cloud/ipfs/QmXpAW9kqXApy6reNfUHXKBuDwVCCq8UG3tkokCgnKSxMd';
    const string_content = 'https://gateway.pinata.cloud/ipfs/QmZYpbA6kKXWk85AEEXu8VGgLVE2L166mJzcuFYBokQpXZ';
    const content = beginCell().storeInt(OFFCHAIN_CONTENT_PREFIX, 8).storeBuffer(Buffer.from(string_first)).endCell();
    const nftContent = beginCell()
        .storeInt(OFFCHAIN_CONTENT_PREFIX, 8)
        .storeBuffer(Buffer.from(string_content))
        .endCell();
    const testWalletsCount = 1;

    const myRoyaltyParams = {
        $$type: 'RoyaltyParams' as 'RoyaltyParams',
        numerator: 100n, // 350n = 35%
        denominator: 1000n,
        destination: owner,
    };

    const collectionParams = {
        $$type: 'CollectionMintParams' as 'CollectionMintParams',
        queryId: 0n,
        owner_address: owner,
        collection_content: content,
        nft_individual_content_url: nftContent,
        royalty_params: myRoyaltyParams,
        mint_limit: 0n,
        nft_price: toNano('1'),
        mint_time_limit: 0n,
        is_sbt: 0n,
        enable_whitelist: true,
        enable_profile: true,
        user_item_limit: 0n,
    };

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        simpleNftMaster = blockchain.openContract(await SimpleNftMaster.fromInit(owner, toNano('0.5')));

        deployer = await blockchain.treasury('deployer');

        await simpleNftMaster.send(
            deployer.getSender(),
            {
                value: toNano('0.5'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            },
        );
        console.log('Master address:', simpleNftMaster.address);
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and simpleNftCollection are ready to use

        const collectionAddress = await simpleNftMaster.getGetCollectionAddressByIndex(0n);
        console.log('Balance on start: ', (await blockchain.getContract(simpleNftMaster.address)).balance);

        await simpleNftMaster.send(
            deployer.getSender(),
            {
                value: toNano('0.5'),
            },
            collectionParams,
        );

        console.log('Collection address:', collectionAddress);
        console.log('Next index:', await simpleNftMaster.getGetNextCollectionIndex());
        if (!collectionAddress) {
            throw Error('Failed to get collection address');
        }
        const whitelistCollection = blockchain.openContract(SimpleNftCollectionV2.fromAddress(collectionAddress));
        const masterData = await whitelistCollection.getGetMasterDataV2();
        console.log('Master data:', masterData);

        expect(await blockchain.getContract(simpleNftMaster.address)).toBeTruthy();

        // expect((await whitelistCollection.getGetMasterDataV2()).master).toEqual(simpleNftMaster.address);
    });

    it('should whitelist', async () => {
        // 1. create N walets and  call RequestWhitelist for each
        // 2. From owner create snake cell and add all in one transaction
        // 3. Check is whitelisted for each

        const collectionAddress = await simpleNftMaster.getGetCollectionAddressByIndex(0n);

        await simpleNftMaster.send(
            deployer.getSender(),
            {
                value: toNano('0.5'),
            },
            collectionParams,
        );

        console.log('Collection address:', collectionAddress);
        console.log('Next index:', await simpleNftMaster.getGetNextCollectionIndex());
        if (!collectionAddress) {
            throw new Error('Failed to create collection');
        }
        const wallets: SandboxContract<TreasuryContract>[] = [];
        const collection = blockchain.openContract(SimpleNftCollectionV2.fromAddress(collectionAddress));
        for (let i = 0; i < testWalletsCount; i++) {
            const wallet = await blockchain.treasury(`user${i}`);
            wallets.push(wallet);
            console.log(`Wallet ${i} address: ${wallet.address.toString()}`);
            await collection.send(
                wallet.getSender(),
                {
                    value: toNano('0.05'), // достаточно для запроса
                },
                'RequestWhitelist',
            );
            await new Promise((resolve) => setTimeout(resolve, 100));
        }

        const snakeCell = buildAddressListCell(wallets.map((w) => w.address)); 
        // makeSnakeAddressCell(wallets.map((w) => w.address));
        // console.log('Checking cell:');
        // const read = readSnakeAddressCell(snakeCell);
        // console.log('Read:', read);

        await collection.send(
            deployer.getSender(),
            { value: toNano('10.5') },
            {
                $$type: 'MassUpdateWhiteList',
                addresses: snakeCell,
                add: true,
            },
        );

        const whitelistStatuses: boolean[] = [];

        console.log('====== Checking whitelists =====');
        for (let i = 0; i < testWalletsCount; i++) {
            const wallet = wallets[i];
            const profileAddress = await collection.getGetBuyerProfileAddress(wallet.address);
            console.log('Profile:', profileAddress);
            const profileContract = blockchain.openContract(BuyerProfile.fromAddress(profileAddress));
            const contractState = await blockchain.getContract(profileAddress);
            console.log('Contract deploy state:', Number(contractState.balance) > 0);
            const is_whitelisted = await profileContract.getIsWhitelisted();
            whitelistStatuses.push(is_whitelisted);
            console.log("Whitelist status:", is_whitelisted);
            if (is_whitelisted) {
                console.log('Minting nft fo user:');
                const nftIndex = (await collection.getGetCollectionData())?.next_item_index;
                if (nftIndex === null || nftIndex === undefined) {
                    console.log('Failed to get nft index');
                    continue;
                }
                const nftAddress = await collection.getGetNftAddressByIndex(nftIndex);
                if (nftAddress === null) {
                    console.log('Failed to get nft index');
                    continue;
                }
                await profileContract.send(
                    wallet.getSender(),
                    {
                        value: toNano('1.05'),
                    },
                    'Mint',
                );
                const nftState = await blockchain.getContract(nftAddress);
                console.log('Deploy check:', Number(nftState.balance) > 0);
            }
        }

        expect(whitelistStatuses).not.toContain(false);
    });

});
