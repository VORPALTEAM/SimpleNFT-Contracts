import type { Address, Cell } from '@ton/core';
import type { CollectionData, CollectionMasterData, CollectionMasterDataV2, GetNftData, RoyaltyParams } from './contracts/tact_SimpleNftMaster';
import type { DeploymentStatus, ProjectCollectionData, ProjectItemData, ProjectServerResult } from './backend-types';
import type { ProjectServerPaths } from './backend-service';

export type SimpleNftNetwork = 'mainnet' | 'testnet';

export type AddressLike = string | Address;

export type Coins = bigint | number | string;

export interface SimpleNftOptions {
    hostname?: string;
    mnemonic?: string | string[];
    network?: SimpleNftNetwork;
    serverPaths?: ProjectServerPaths;
}

export interface CollectionCreationData {
    master: AddressLike;
    owner?: AddressLike;
    collectionContent: string | Cell;
    nftIndividualContent: string | Cell;
    royaltyParams?: Omit<RoyaltyParams, '$$type'> | RoyaltyParams;
    mintLimit?: bigint | number | string;
    mintTimeLimit?: bigint | number | string;
    isSbt?: boolean | bigint | number | string;
    nftPrice?: Coins;
    enableProfile?: boolean;
    enableWhitelist?: boolean;
    userItemLimit?: bigint | number | string;
    queryId?: bigint | number | string;
    value?: Coins;
    waitForDeploy?: boolean;
    waitAttempts?: number;
    waitIntervalMs?: number;
}

export interface CollectionInfo {
    collectionData: CollectionData;
    masterData: CollectionMasterData | CollectionMasterDataV2;
    sampleNftContent: Cell | null;
}

export type NftData = GetNftData;

export interface CreateCollectionResult {
    address: Address;
    deployed: boolean;
    status: DeploymentStatus;
    blockchainData: CollectionInfo | null;
    serverData: ProjectServerResult<ProjectCollectionData>;
}

export interface MintNftInCollectionResult {
    address: Address | null;
    collection: Address;
    deployed: boolean;
    status: DeploymentStatus;
    blockchainData: NftData | null;
    serverData: ProjectServerResult<ProjectItemData>;
}
