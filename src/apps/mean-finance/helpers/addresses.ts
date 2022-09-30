import { Network } from "~types";

type AddressMap<K extends PositionVersions> = {
  [k in K]: Partial<Record<Network, string>>;
};

type PositionVersion2Type = '2';
type PositionVersion3Type = '3';
type PositionVersion4Type = '4';
export const POSITION_VERSION_2: PositionVersion2Type = '2'; // VULN
export const POSITION_VERSION_3: PositionVersion3Type = '3'; // POST-VULN
export const POSITION_VERSION_4: PositionVersion4Type = '4'; // YIELD

export type PositionVersions = PositionVersion2Type | PositionVersion3Type | PositionVersion4Type;

export const POSITIONS_VERSIONS: PositionVersions[] = [POSITION_VERSION_2, POSITION_VERSION_3, POSITION_VERSION_4];

export const HUB_ADDRESS: AddressMap<PositionVersions> = {
  [POSITION_VERSION_2]: {
    [Network.OPTIMISM_MAINNET]: '0x230C63702D1B5034461ab2ca889a30E343D81349',
    [Network.POLYGON_MAINNET]: '0x230C63702D1B5034461ab2ca889a30E343D81349',
  },
  [POSITION_VERSION_3]: {
    [Network.OPTIMISM_MAINNET]: '0x059d306A25c4cE8D7437D25743a8B94520536BD5',
    [Network.POLYGON_MAINNET]: '0x059d306A25c4cE8D7437D25743a8B94520536BD5',
  },
  [POSITION_VERSION_4]: {
    [Network.POLYGON_MAINNET]: '0xa43cc0B95Ec985BF45fc03262150c20caE180952',
  },
};

export const PERMISSION_MANAGER_ADDRESS: AddressMap<PositionVersions> = {
  [POSITION_VERSION_2]: {
    [Network.OPTIMISM_MAINNET]: '0xB4Edfb45446C6A207643Ea846BFA42021cE5ae11',
    [Network.POLYGON_MAINNET]: '0xB4Edfb45446C6A207643Ea846BFA42021cE5ae11',
  },
  [POSITION_VERSION_3]: {
    [Network.OPTIMISM_MAINNET]: '0x6f54391fE0386D506b51d69Deeb8b04E0544E088',
    [Network.POLYGON_MAINNET]: '0x6f54391fE0386D506b51d69Deeb8b04E0544E088',
  },
  [POSITION_VERSION_4]: {
    [Network.POLYGON_MAINNET]: '0x516cB11697bf1bA2dbb5C081C23F169791c4bd01',
  },
};

export const MEAN_GRAPHQL_URL: AddressMap<PositionVersions> = {
  [POSITION_VERSION_2]: {
    [Network.OPTIMISM_MAINNET]: 'https://api.thegraph.com/subgraphs/name/mean-finance/dca-v2-ys-vulnerable-optimism',
    [Network.POLYGON_MAINNET]: 'https://api.thegraph.com/subgraphs/name/mean-finance/dca-v2-ys-vulnerable-polygon',
  },
  [POSITION_VERSION_3]: {
    [Network.OPTIMISM_MAINNET]: 'https://api.thegraph.com/subgraphs/name/mean-finance/dca-v2-ys-optimism',
    [Network.POLYGON_MAINNET]: 'https://api.thegraph.com/subgraphs/name/mean-finance/dca-v2-ys-polygon',
  },
  [POSITION_VERSION_4]: {
    [Network.POLYGON_MAINNET]: 'https://api.thegraph.com/subgraphs/name/mean-finance/dca-v2-yf-polygon',
    [Network.OPTIMISM_MAINNET]: 'https://api.thegraph.com/subgraphs/name/mean-finance/dca-v2-yf-optimism',
  },
};
