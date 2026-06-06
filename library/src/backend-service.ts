import { Address } from '@ton/core';
import { buildUrl, getJsonResult } from './api';
import type { ProjectCollectionData, ProjectItemData, ProjectServerResult } from './backend-types';

export interface ProjectServerPaths {
    collectionData?: (address: string) => string;
    itemData?: (address: string) => string;
}

const defaultPaths: Required<ProjectServerPaths> = {
    collectionData: (address) => `/api/collection/${address}`,
    itemData: (address) => `/api/item/${address}`,
};

function stringifyAddress(address: string | Address): string {
    return typeof address === 'string' ? address : address.toString();
}

export class ProjectBackendService {
    public readonly hostname: string;
    private readonly paths: Required<ProjectServerPaths>;

    constructor(hostname: string, paths: ProjectServerPaths = {}) {
        this.hostname = hostname;
        this.paths = {
            ...defaultPaths,
            ...paths,
        };
    }

    public collectionData(address: string | Address): Promise<ProjectServerResult<ProjectCollectionData>> {
        const stringAddress = stringifyAddress(address);
        return getJsonResult<ProjectCollectionData>(buildUrl(this.hostname, this.paths.collectionData(stringAddress)));
    }

    public itemData(address: string | Address): Promise<ProjectServerResult<ProjectItemData>> {
        const stringAddress = stringifyAddress(address);
        return getJsonResult<ProjectItemData>(buildUrl(this.hostname, this.paths.itemData(stringAddress)));
    }
}
