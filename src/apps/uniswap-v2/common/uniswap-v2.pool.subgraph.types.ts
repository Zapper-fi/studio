import { gql } from 'graphql-request';

export const DEFAULT_POOLS_QUERY = gql`
  query getPools($first: Int, $skip: Int, $orderBy: Pair_orderBy) {
    pairs(first: $first, skip: $skip, orderBy: $orderBy, orderDirection: desc) {
      id
    }
  }
`;

export const DEFAULT_POOLS_BY_ID_QUERY = gql`
  query getPoolsById($ids: [ID!]) {
    pairs(where: { id_in: $ids }) {
      id
    }
  }
`;

export const DEFAULT_LAST_BLOCK_SYNCED_ON_GRAPH_QUERY = gql`
  {
    _meta {
      block {
        number
      }
    }
  }
`;

export const FURA_LAST_BLOCK_SYNCED_ON_GRAPH_QUERY = gql`
  query getFuraLatestBlockNumber($subgraphName: String) {
    indexingStatusForCurrentVersion(subgraphName: $subgraphName) {
      chains {
        latestBlock {
          number
        }
      }
    }
  }
`;

export const DEFAULT_POOL_VOLUMES_QUERY = gql`
  query getCurrentPairVolumes($first: Int) {
    pairs(first: $first, skip: 0, orderBy: reserveUSD, orderDirection: desc) {
      id
      volumeUSD
      untrackedVolumeUSD
    }
  }
`;

export const DEFAULT_POOL_VOLUMES_AT_BLOCK_QUERY = gql`
  query getCurrentPairVolumes($first: Int, $block: Int) {
    pairs(first: $first, skip: 0, orderBy: reserveUSD, orderDirection: desc, block: { number: $block }) {
      id
      volumeUSD
      untrackedVolumeUSD
    }
  }
`;

export const DEFAULT_POOL_VOLUMES_BY_ID_QUERY = gql`
  query getPastPairVolumesByID($ids: [String]) {
    pairs(where: { id_in: $ids }) {
      id
      volumeUSD
      untrackedVolumeUSD
    }
  }
`;

export const DEFAULT_POOL_VOLUMES_BY_ID_AT_BLOCK_QUERY = gql`
  query getPastPairVolumesByID($ids: [String], $block: Int) {
    pairs(where: { id_in: $ids }, block: { number: $block }) {
      id
      volumeUSD
      untrackedVolumeUSD
    }
  }
`;

export const DEFAULT_SINGLE_POOL_VOLUME_AT_BLOCK_QUERY = gql`
  query getSinglePairVolume($id: String, $block: Int) {
    pair(id: $id, block: { number: $block }) {
      id
      volumeUSD
      untrackedVolumeUSD
    }
  }
`;

export type PoolsResponse = {
  pairs?: {
    id: string;
  }[];
};

export type LastBlockSyncedResponse = {
  _meta: {
    block: {
      number: number;
    };
  };
};

export type LastBlockSyncedFuraResponse = {
  indexingStatusForCurrentVersion: {
    chains: {
      latestBlock: {
        number: number;
      };
    }[];
  };
};

export type PoolVolumesResponse = {
  pairs: {
    id: string;
    volumeUSD: string;
    untrackedVolumeUSD: string;
  }[];
};

export type SinglePoolVolumeResponse = {
  pair: {
    id: string;
    volumeUSD: string;
    untrackedVolumeUSD: string;
  };
};
