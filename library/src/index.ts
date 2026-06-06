import { Address, Cell, OpenedContract, toNano } from '@ton/core';
import { mnemonicToPrivateKey } from '@ton/crypto';
import { TonClient, WalletContractV5R1 } from '@ton/ton';
import { SimpleNftMaster } from './contracts/tact_SimpleNftMaster';
import { SimpleNftCollectionV2 } from './contracts/tact_SimpleNftCollectionV2';
import { NftItem } from './contracts/tact_NftItem';
import { ProjectBackendService } from './backend-service';
import { normalizeContent } from './content';
import type {
    AddressLike,
    Coins,
    CollectionCreationData,
    CollectionInfo,
    CreateCollectionResult,
    MintNftInCollectionResult,
    NftData,
    SimpleNftNetwork,
    SimpleNftOptions,
} from './types';
import type { ProjectCollectionData, ProjectItemData, ProjectServerResult } from './backend-types';

export { Address, Cell, toNano };
export type {
    AddressLike,
    Coins,
    CollectionCreationData,
    CollectionInfo,
    CreateCollectionResult,
    MintNftInCollectionResult,
    NftData,
    SimpleNftNetwork,
    SimpleNftOptions,
};
export type {
    Attribute,
    CollectionFileData,
    DeploymentStatus,
    ItemFileData,
    ProjectCollectionData,
    ProjectItemData,
    ProjectServerResult,
    ProjectServerStatus,
} from './backend-types';
export { ProjectBackendService } from './backend-service';
export type {
    CollectionData,
    CollectionMasterData,
    CollectionMasterDataV2,
    CollectionMintParams,
    GetNftData,
    RoyaltyParams,
} from './contracts/tact_SimpleNftMaster';

const SDK_VERSION = '0.1.0';
const DEFAULT_HOSTNAME = 'https://api.simplenft.io';
const DEFAULT_NETWORK: SimpleNftNetwork = 'mainnet';

type WalletState = {
    wallet: OpenedContract<WalletContractV5R1>;
    secretKey: Buffer;
};

function endpointFor(network: SimpleNftNetwork): string {
    return `https://${network === 'testnet' ? 'testnet.' : ''}toncenter.com/api/v2/jsonRPC`;
}

function normalizeMnemonic(mnemonic?: string | string[]): string[] | undefined {
    if (!mnemonic) {
        return undefined;
    }

    if (Array.isArray(mnemonic)) {
        return mnemonic;
    }

    return mnemonic.trim().split(/\s+/).filter(Boolean);
}

function parseAddressOrThrow(address: AddressLike): Address {
    return typeof address === 'string' ? Address.parse(address) : address;
}

function parseBigint(value: bigint | number | string | undefined, fallback: bigint): bigint {
    if (value === undefined) {
        return fallback;
    }

    return BigInt(value);
}

function parseSbt(value: CollectionCreationData['isSbt']): bigint {
    if (typeof value === 'boolean') {
        return value ? 1n : 0n;
    }

    return parseBigint(value, 0n);
}

function parseCoins(value: Coins | undefined, fallback: string): bigint {
    return value === undefined ? toNano(fallback) : toNano(value);
}

async function waitForDeploy(client: TonClient, address: Address, attempts: number, intervalMs: number): Promise<boolean> {
    for (let attempt = 0; attempt < attempts; attempt += 1) {
        if (await client.isContractDeployed(address)) {
            return true;
        }

        await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }

    return false;
}

export class SimpleNft {
    public readonly hostname: string;
    public readonly network: SimpleNftNetwork;
    public readonly client: TonClient;
    public readonly backend: ProjectBackendService;

    private readonly mnemonic?: string[];
    private walletState?: Promise<WalletState>;

    public readonly getters = {
        isDeploy: async (contract: Address): Promise<boolean> => this.isDeploy(contract),
        parseAddress: (address: AddressLike): string | null => this.parseAddress(address),
        blockchain: {
            collectionData: async (collection: Address): Promise<CollectionInfo> => this.blockchainCollectionData(collection),
            collectiondata: async (collection: Address): Promise<CollectionInfo> => this.blockchainCollectionData(collection),
            nftData: async (address: Address): Promise<NftData> => this.blockchainNftData(address),
        },
        server: {
            collectionData: async (collection: AddressLike): Promise<ProjectServerResult<ProjectCollectionData>> =>
                this.serverCollectionData(collection),
            collectiondata: async (collection: AddressLike): Promise<ProjectServerResult<ProjectCollectionData>> =>
                this.serverCollectionData(collection),
            itemData: async (address: AddressLike): Promise<ProjectServerResult<ProjectItemData>> => this.serverItemData(address),
            itemdata: async (address: AddressLike): Promise<ProjectServerResult<ProjectItemData>> => this.serverItemData(address),
            nftData: async (address: AddressLike): Promise<ProjectServerResult<ProjectItemData>> => this.serverItemData(address),
        },
        collectionData: async (collection: Address): Promise<CollectionInfo> => this.blockchainCollectionData(collection),
        collectiondata: async (collection: Address): Promise<CollectionInfo> => this.blockchainCollectionData(collection),
        nftData: async (address: Address): Promise<NftData> => this.blockchainNftData(address),
    };

    public readonly transactions = {
        createCollection: async (data: CollectionCreationData): Promise<CreateCollectionResult> => this.createCollection(data),
        mintNftInCollection: async (collection: Address): Promise<MintNftInCollectionResult> => this.mintNftInCollection(collection),
    };

    constructor(options: SimpleNftOptions = {}) {
        this.hostname = options.hostname ?? DEFAULT_HOSTNAME;
        this.network = options.network ?? DEFAULT_NETWORK;
        this.mnemonic = normalizeMnemonic(options.mnemonic);
        this.client = new TonClient({ endpoint: endpointFor(this.network) });
        this.backend = new ProjectBackendService(this.hostname, options.serverPaths);
    }

    public version(): string {
        return SDK_VERSION;
    }

    private async wallet(): Promise<WalletState> {
        if (!this.mnemonic) {
            throw new Error('Mnemonic is required for transaction methods');
        }

        if (!this.walletState) {
            this.walletState = (async () => {
                const keyPair = await mnemonicToPrivateKey(this.mnemonic as string[]);
                const wallet = this.client.open(
                    WalletContractV5R1.create({
                        workchain: 0,
                        publicKey: keyPair.publicKey,
                    }),
                );

                return {
                    wallet,
                    secretKey: keyPair.secretKey,
                };
            })();
        }

        return this.walletState;
    }

    private async isDeploy(contract: Address): Promise<boolean> {
        return this.client.isContractDeployed(contract);
    }

    private parseAddress(address: AddressLike): string | null {
        try {
            return parseAddressOrThrow(address).toString({ bounceable: true, urlSafe: true });
        } catch {
            return null;
        }
    }

    private async blockchainCollectionData(collection: Address): Promise<CollectionInfo> {
        const contract = this.client.open(SimpleNftCollectionV2.fromAddress(collection));
        const collectionData = await contract.getGetCollectionData();
        const masterData = await this.getCollectionMasterData(contract);
        const sampleNftContent = await this.getSampleNftContent(contract);

        return {
            collectionData,
            masterData,
            sampleNftContent,
        };
    }

    private async getCollectionMasterData(contract: OpenedContract<SimpleNftCollectionV2>): Promise<CollectionInfo['masterData']> {
        try {
            return await contract.getGetMasterDataV2();
        } catch {
            return contract.getGetMasterData();
        }
    }

    private async getSampleNftContent(contract: OpenedContract<SimpleNftCollectionV2>): Promise<Cell | null> {
        try {
            return await contract.getGetSampleNftContent();
        } catch {
            return null;
        }
    }

    private async blockchainNftData(address: Address): Promise<NftData> {
        const contract = this.client.open(NftItem.fromAddress(address));
        return contract.getGetNftData();
    }

    private async serverCollectionData(collection: AddressLike): Promise<ProjectServerResult<ProjectCollectionData>> {
        return this.backend.collectionData(parseAddressOrThrow(collection));
    }

    private async serverItemData(address: AddressLike): Promise<ProjectServerResult<ProjectItemData>> {
        return this.backend.itemData(parseAddressOrThrow(address));
    }

    private skippedServerData<T>(address: Address | null, resource: string): ProjectServerResult<T> {
        return {
            ok: false,
            status: 'request_failed',
            url: `${this.hostname}/${resource}/${address?.toString() ?? 'unknown'}`,
            error: 'Deployment was not confirmed; server data was not requested',
        };
    }

    private deploymentStatus(serverData: ProjectServerResult<unknown>, deployed: boolean): CreateCollectionResult['status'] {
        if (!deployed) {
            return 'deployment_not_confirmed';
        }

        return serverData.ok ? 'deployed_with_server_data' : 'deployed_server_data_unavailable';
    }

    private async createCollection(data: CollectionCreationData): Promise<CreateCollectionResult> {
        const { wallet, secretKey } = await this.wallet();
        const master = this.client.open(SimpleNftMaster.fromAddress(parseAddressOrThrow(data.master)));

        if (!(await this.client.isContractDeployed(master.address))) {
            throw new Error(`Master contract is not deployed: ${master.address.toString()}`);
        }

        const nextIndex = await master.getGetNextCollectionIndex();
        const collectionAddress = await master.getGetCollectionAddressByIndex(nextIndex);

        if (!collectionAddress) {
            throw new Error(`Unable to resolve collection address for index ${nextIndex.toString()}`);
        }

        const owner = data.owner ? parseAddressOrThrow(data.owner) : wallet.address;
        const royaltyDestination = data.royaltyParams?.destination ?? owner;

        await master.send(
            wallet.sender(secretKey),
            {
                value: parseCoins(data.value, '0.25'),
            },
            {
                $$type: 'CollectionMintParams',
                queryId: parseBigint(data.queryId, 0n),
                owner_address: owner,
                collection_content: normalizeContent(data.collectionContent),
                nft_individual_content_url: normalizeContent(data.nftIndividualContent),
                royalty_params: {
                    $$type: 'RoyaltyParams',
                    numerator: data.royaltyParams?.numerator ?? 100n,
                    denominator: data.royaltyParams?.denominator ?? 1000n,
                    destination: parseAddressOrThrow(royaltyDestination),
                },
                mint_limit: parseBigint(data.mintLimit, 100n),
                mint_time_limit: parseBigint(data.mintTimeLimit, 1900000000n),
                is_sbt: parseSbt(data.isSbt),
                nft_price: parseCoins(data.nftPrice, '0.2'),
                enable_profile: data.enableProfile ?? false,
                enable_whitelist: data.enableWhitelist ?? false,
                user_item_limit: parseBigint(data.userItemLimit, 0n),
            },
        );

        const deployed = data.waitForDeploy ?? true
            ? await waitForDeploy(this.client, collectionAddress, data.waitAttempts ?? 30, data.waitIntervalMs ?? 3000)
            : await this.client.isContractDeployed(collectionAddress);

        const blockchainData = deployed ? await this.blockchainCollectionData(collectionAddress) : null;
        const serverData = deployed
            ? await this.serverCollectionData(collectionAddress)
            : this.skippedServerData<ProjectCollectionData>(collectionAddress, 'api/collection');

        return {
            address: collectionAddress,
            deployed,
            status: this.deploymentStatus(serverData, deployed),
            blockchainData,
            serverData,
        };
    }

    private async mintNftInCollection(collection: Address): Promise<MintNftInCollectionResult> {
        const { wallet, secretKey } = await this.wallet();
        const contract = this.client.open(SimpleNftCollectionV2.fromAddress(collection));

        if (!(await this.client.isContractDeployed(collection))) {
            throw new Error(`Collection contract is not deployed: ${collection.toString()}`);
        }

        const collectionData = await contract.getGetCollectionData();
        const masterData = await this.getCollectionMasterData(contract);
        const nftAddress = await contract.getGetNftAddressByIndex(collectionData.next_item_index);

        await contract.send(
            wallet.sender(secretKey),
            {
                value: masterData.price,
            },
            'Mint',
        );

        const deployed = nftAddress
            ? await waitForDeploy(this.client, nftAddress, 30, 3000)
            : false;
        const blockchainData = deployed && nftAddress ? await this.blockchainNftData(nftAddress) : null;
        const serverData = deployed && nftAddress
            ? await this.serverItemData(nftAddress)
            : this.skippedServerData<ProjectItemData>(nftAddress, 'api/item');

        return {
            address: nftAddress,
            collection,
            deployed,
            status: this.deploymentStatus(serverData, deployed),
            blockchainData,
            serverData,
        };
    }
}

export default SimpleNft;
