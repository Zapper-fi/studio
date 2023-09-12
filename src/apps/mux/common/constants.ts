import { BigNumber } from 'bignumber.js';

import { Network } from '~types';

export const _0: BigNumber = new BigNumber('0');
export const DECIMALS = 18;
export const RATIO_DECIMALS = 5;
export const ASSET_IS_STABLE = 0x00000000000001; // is a usdt, usdc, ...
export const ASSET_CAN_ADD_REMOVE_LIQUIDITY = 0x00000000000002; // can call addLiquidity and removeLiquidity with this token
export const ASSET_IS_TRADABLE = 0x00000000000100; // allowed to be assetId
export const ASSET_IS_OPENABLE = 0x00000000010000; // can open position
export const ASSET_IS_SHORTABLE = 0x00000001000000; // allow shorting this asset
export const ASSET_USE_STABLE_TOKEN_FOR_PROFIT = 0x00000100000000; // take profit will get stable coin
export const ASSET_IS_ENABLED = 0x00010000000000; // allowed to be assetId and collateralId
export const ASSET_IS_STRICT_STABLE = 0x01000000000000; // assetPrice is always 1 unless volatility exceeds strictStableDeviation

export const READER_ADDRESS = {
  [Network.ARBITRUM_MAINNET]: '0xf64b4bd682e792e0ba78956b86f2cee946d2e7d6',
  [Network.BINANCE_SMART_CHAIN_MAINNET]: '0x9897a73a606606394fa2324d16f3926f5963a9c3',
  [Network.AVALANCHE_MAINNET]: '0xce443b8c1c3e3edb3b9f3b2b482faac09a95b01d',
  [Network.FANTOM_OPERA_MAINNET]: '0x30acc119f8b60c9cb92b8e3c4c7f8830c82f707e',
  [Network.OPTIMISM_MAINNET]: '0xdf88fe94ef674d8c1ab1743ad88717e7ae893a44',
};

export const USDC_ADDRESS = {
  [Network.ARBITRUM_MAINNET]: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
  [Network.BINANCE_SMART_CHAIN_MAINNET]: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
  [Network.AVALANCHE_MAINNET]: '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e',
  [Network.FANTOM_OPERA_MAINNET]: '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
  [Network.OPTIMISM_MAINNET]: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
};

export const VAULT_ADDRESS = {
  [Network.ARBITRUM_MAINNET]: '0x917952280770daa800e1b4912ea08450bf71d57e',
  [Network.BINANCE_SMART_CHAIN_MAINNET]: '0x8d751570ba1fd8a8ae89e4b27d18bf6c321aab0a',
  [Network.AVALANCHE_MAINNET]: '0x29a28cc3fdc128693ef6a596ef45c43ff63b7062',
  [Network.FANTOM_OPERA_MAINNET]: '0xdaf2064f52f123ee1d410e97c2df549c23a99683',
  [Network.OPTIMISM_MAINNET]: '0x39d653884b611e0a8dbdb9720ad5d75642fd544b',
};

export const MUXLP_ADDRESS = {
  [Network.ARBITRUM_MAINNET]: '0x7cbaf5a14d953ff896e5b3312031515c858737c8',
  [Network.BINANCE_SMART_CHAIN_MAINNET]: '0x07145ad7c7351c6fe86b6b841fc9bed74eb475a7',
  [Network.AVALANCHE_MAINNET]: '0xaf2d365e668baafedcfd256c0fbbe519e594e390',
  [Network.FANTOM_OPERA_MAINNET]: '0xddade9a8da4851960dfcff1ae4a18ee75c39edd2',
  [Network.OPTIMISM_MAINNET]: '0x0509474f102b5cd3f1f09e1e91feb25938ef0f17',
};

export const POOL_ADDRESS = {
  [Network.ARBITRUM_MAINNET]: '0x3e0199792ce69dc29a0a36146bfa68bd7c8d6633',
  [Network.BINANCE_SMART_CHAIN_MAINNET]: '0x855e99f768fad76dd0d3eb7c446c0b759c96d520',
  [Network.AVALANCHE_MAINNET]: '0x0ba2e492e8427fad51692ee8958ebf936bee1d84',
  [Network.FANTOM_OPERA_MAINNET]: '0x2e81f443a11a943196c88afcb5a0d807721a88e6',
  [Network.OPTIMISM_MAINNET]: '0xc6bd76fa1e9e789345e003b361e4a0037dfb7260',
};

export const GRAPH_URL = {
  [Network.ARBITRUM_MAINNET]: 'https://api.thegraph.com/subgraphs/name/mux-world/mux-arb?source=zapper',
  [Network.BINANCE_SMART_CHAIN_MAINNET]: 'https://api.thegraph.com/subgraphs/name/mux-world/mux-bsc?source=zapper',
  [Network.AVALANCHE_MAINNET]: 'https://api.thegraph.com/subgraphs/name/mux-world/mux-ava?source=zapper',
  [Network.FANTOM_OPERA_MAINNET]: 'https://api.thegraph.com/subgraphs/name/mux-world/mux-ftm?source=zapper',
  [Network.OPTIMISM_MAINNET]: 'https://api.thegraph.com/subgraphs/name/mux-world/mux-op?source=zapper',
};
