export interface CollectionFileData {
    name: string;
    description: string;
    social_links: string[];
    imageUrl: string;
    backgroundUrl: string;
}

export interface Attribute {
    trait_type: string;
    value: string;
}

export interface ItemFileData {
    name?: string;
    description?: string;
    marketplace?: string;
    image: string;
    attributes: Attribute[];
    content_type?: string;
    content_url?: string;
}

export interface ProjectCollectionData {
    owner: string;
    address: string;
    mint_limit: number;
    price: number;
    next_item_index?: number;
    next_item_address?: string;
    data_url: string;
    item_data_url?: string;
    is_sbt?: boolean;
    mint_time_limit?: number;
    is_hidden_by_owner?: boolean;
    enable_whitelist?: boolean | null;
    user_item_limit?: number;
    stars?: number;
    volume?: number;
    experience?: number;
}

export interface ProjectItemData {
    address: string;
    collection: string;
    data_url: string;
    index_in_collection: string;
    minter?: string;
    metadata?: ItemFileData;
}

export type ProjectServerStatus = 'ok' | 'not_found' | 'request_failed' | 'invalid_response';

export type ProjectServerResult<T> =
    | {
          ok: true;
          status: 'ok';
          url: string;
          data: T;
      }
    | {
          ok: false;
          status: Exclude<ProjectServerStatus, 'ok'>;
          url: string;
          error: string;
          httpStatus?: number;
      };

export type DeploymentStatus =
    | 'deployed_with_server_data'
    | 'deployed_server_data_unavailable'
    | 'deployment_not_confirmed';
