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
    [Network.OPTIMISM_MAINNET]: '0xa43cc0B95Ec985BF45fc03262150c20caE180952',
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
    [Network.OPTIMISM_MAINNET]: '0x516cB11697bf1bA2dbb5C081C23F169791c4bd01',
  },
};

export const TRANSFORMER_REGISTRY_ADDRESS: AddressMap<PositionVersions> = {
  [POSITION_VERSION_2]: {},
  [POSITION_VERSION_3]: {},
  [POSITION_VERSION_4]: {
    [Network.POLYGON_MAINNET]: '0xC0136591Df365611B1452B5F8823dEF69Ff3A685',
    [Network.OPTIMISM_MAINNET]: '0xC0136591Df365611B1452B5F8823dEF69Ff3A685',
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

// Mean Finance Wrapped-4626 -> Unwrapped yield-bearing token
export const ERC4626WRAP_ADDRESSES = {
  [Network.POLYGON_MAINNET]: {
    '0x021c618f299e0f55e8a684898b03b027eb51df5c': '0x6d80113e533a2C0fe82EaBD35f1875DcEA89Ea97', // AAVE_V3_WMATIC
    '0x42474cdc4a9d9c06e91c745984dd319c1f107f9a': '0x078f358208685046a11C85e8ad32895DED33A249', // AAVE_V3_WBTC
    '0xa7a7ffe0520e90491e58c9c77f78d7cfc32d019e': '0xe50fA9b3c56FfB159cB0FCA61F5c9D750e8128c8', // AAVE_V3_WETH
    '0xe3e5e1946d6e4d8a5e5f155b6e059a2ca7c43c58': '0x625E7708f30cA75bfd92586e17077590C60eb4cD', // AAVE_V3_USDC
    '0xcc0da22f5e89a7401255682b2e2e74edd4c62fc4': '0xf329e36C7bF6E5E86ce2150875a84Ce77f477375', // AAVE_V3_AAVE
    '0x6e6bbc7b9fe1a8e5b9f27cc5c6478f65f120fe52': '0x82E64f49Ed5EC1bC6e43DAD4FC8Af9bb3A2312EE', // AAVE_V3_DAI
    '0x018532fde0251473f3bc379e133cdb508c412eed': '0x6ab707Aca953eDAeFBc4fD23bA73294241490620', // AAVE_V3_USDT
    '0x5e474399c0d3da173a76ad6676f3c32c97babeaf': '0x191c10Aa4AF7C30e871E70C95dB0E4eb77237530', // AAVE_V3_LINK
    '0xc0b8d48064b9137858ccc2d6c07b7432aae2aa90': '0x8437d7c167dfb82ed4cb79cd44b7a32a1dd95c77', // AAVE_V3_AGEUR
    '0x53e41d76892c681ef0d10df5a0262a3791b771ab': '0x38d693ce1df5aadf7bc62595a37d667ad57922e5', // AAVE_V3_EURS
    '0x2bcf2a8c5f9f8b45ece5ba11d8539780fc15cb11': '0x513c7e3a9c69ca3e22550ef58ac1c0088e918fff', // AAVE_V3_CRV
    '0xbf3df32b05efc5d5a084fbe4d2076fbc3ce88f00': '0xc45a479877e1e9dfe9fcd4056c699575a1045daa', // AAVE_V3_SUSHI
    '0x83c0936d916d036f99234fa35de12988abd66a7f': '0x8eb270e296023e9d92081fdf967ddd7878724424', // AAVE_V3_GHST
    '0x1dd5629903441b2dd0d03f76ec7673add920e765': '0x6533afac2e7bccb20dca161449a13a32d391fb00', // AAVE_V3_JEUR
    '0x68f677e667dac3b29c646f44a154dec80db6e811': '0x8ffdf2de812095b1d19cb146e4c004587c0a0692', // AAVE_V3_BAL
    '0x25ad39beee8ddc8d6503ef84881426b65e52c640': '0xeBe517846d0F36eCEd99C735cbF6131e1fEB775D', // AAVE_V3_miMATIC
  },
  [Network.OPTIMISM_MAINNET]: {
    '0xda9a381bcbd9173cc841109840feed4d8d7dcb3b': '0xf329e36C7bF6E5E86ce2150875a84Ce77f477375', // AAVE_V3_AAVE
    '0x4a29af8683fFc6259BECcfd583134A0D13BE535c': '0x82E64f49Ed5EC1bC6e43DAD4FC8Af9bb3A2312EE', // AAVE_V3_DAI
    '0x58ffcdac112d0c0f7b6ac38fb15d178b83663249': '0x6ab707aca953edaefbc4fd23ba73294241490620', // AAVE_V3_USDT
    '0x8127ce8a7055e2e99c94aee6e20ffc2bdb3770a8': '0x191c10Aa4AF7C30e871E70C95dB0E4eb77237530', // AAVE_V3_LINK
    '0x329c754e060c17542f34bf3287c70bfaad7d288a': '0x6d80113e533a2C0fe82EaBD35f1875DcEA89Ea97', // AAVE_V3_SUSD
    '0xfe7296c374d996d09e2ffe533eeb85d1896e1b14': '0x625E7708f30cA75bfd92586e17077590C60eb4cD', // AAVE_V3_USDC
    '0x4f8424ba880b109c31ce8c5eefc4b82b8897eec0': '0x078f358208685046a11C85e8ad32895DED33A249', // AAVE_V3_WBTC
    '0xdfc636088b4f73f6bda2e9c31e7ffebf4e3646e9': '0xe50fA9b3c56FfB159cB0FCA61F5c9D750e8128c8', // AAVE_V3_WETH
  }
}
