import { Acrossv2PoolDefinition,  AcrosstTokenDefinition } from './across.types';

export const ACROSS_V2_POOL_DEFINITIONS: Acrossv2PoolDefinition[] = [
  {
    queryKey: 'HubPool',
    label: 'Across HubPool',
    poolAddress: '0xc186fA914353c44b2E33eBE05f21846F1048bEda',
    chainId: 1,
    isSpokePool: false,
  },
  {
    queryKey: 'Ethereum_SpokePool',
    label: 'Across Ethereum_SpokePool',
    poolAddress: '0x4D9079Bb4165aeb4084c526a32695dCfd2F77381',
    chainId: 1,
    isSpokePool: true,
  },
  {
    queryKey: 'Optimism_SpokePool',
    label: 'Across Optimism_SpokePool',
    poolAddress: '0xa420b2d1c0841415A695b81E5B867BCD07Dff8C9',
    chainId: 10,
    isSpokePool: true,
  },
  {
    queryKey: 'Polygon_SpokePool',
    label: 'Across Polygon_SpokePool',
    poolAddress: '0x69B5c72837769eF1e7C164Abc6515DcFf217F920',
    chainId: 137,
    isSpokePool: true,
  },
  {
    queryKey: 'Boba_SpokePool',
    label: 'Across Boba_SpokePool',
    poolAddress: '0xBbc6009fEfFc27ce705322832Cb2068F8C1e0A58',
    chainId: 288,
    isSpokePool: true,
  },
  {
    queryKey: 'Arbitrum_SpokePool',
    label: 'Across Arbitrum_SpokePool',
    poolAddress: '0x02fbb64517E1c6ED69a6FAa3ABf37Db0482f1152',
    chainId: 42161,
    isSpokePool: true,
  },
];

export const POOL_TOKENS:AcrosstTokenDefinition[] = [
  {
    queryKey: 'badger',
    symbol: 'BADGER',
    tokenAddress: '0x3472a5a71965499acd81997a54bba8d852c6e53d',
  },
  {
    queryKey: 'boba',
    symbol: 'BOBA',
    tokenAddress: '0x42bbfa2e77757c645eeaad1655e0911a7553efbc'
  },
  {
    queryKey: 'dai',
    symbol: 'DAI',
    tokenAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
  },
  {
    queryKey: 'uma',
    symbol: 'UMA',
    tokenAddress: '0x04fa0d235c4abf4bcf4787af4cf447de572ef828',
  },
  {
    queryKey: 'usdc',
    symbol: 'USDC',
    tokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  },
  {
    queryKey: 'wbtc',
    symbol: 'WBTC',
    tokenAddress: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
  },
  {
    queryKey: 'weth',
    symbol: 'WETH',
    tokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  },
]