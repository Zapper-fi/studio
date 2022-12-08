import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { InsuraceMiningTokenFetcher } from '../common/insurace.mining.token-fetcher';

@PositionTemplate()
export class EthereumInsuraceMiningTokenFetcher extends InsuraceMiningTokenFetcher {
  groupLabel = 'Mining Pools';
  insurTokenAddress = '0x544c42fbb96b39b21df61cf322b5edc285ee7429';
  stakersPoolV2Address = '0x136d841d4bece3fc0e4debb94356d8b6b4b93209';

  governanceMiningPools = [
    {
      address: '0x7e68521a2814a84868da716b9f436b53e6764c1d',
      underlyingTokenAddress: '0x544c42fbb96b39b21df61cf322b5edc285ee7429', // INSUR
    },
  ];

  underwritingMiningPools = [
    {
      address: '0xdf8bec949367b677b7c951219ed66035ddc73d3f',
      underlyingTokenAddress: ZERO_ADDRESS, // ETH
    },
    {
      address: '0xee516e05cecfee5fe72930f3b38b87594434fd00',
      underlyingTokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // WETH
    },
    {
      address: '0x5157e052ae30381e38874a9b3452aabc9f145182',
      underlyingTokenAddress: '0x6b175474e89094c44da98b954eedeac495271d0f', // DAI
    },
    {
      address: '0x3d9317a27f3d83f0821deeeb0befdb68d4c9cd47',
      underlyingTokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
    },
    {
      address: '0x8ce730bbaf5ed1b9e8cf2d857f474bdcdeb22275',
      underlyingTokenAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT
    },
    {
      address: '0xd9aae8f651f323cbb39e328b8fda741d11a231e0',
      underlyingTokenAddress: '0xe2f2a5c287993345a840db3b0845fbc70f5935a5', // mUSD
    },
  ];

  liquidityMiningPools = [
    {
      address: '0x07d8d49c5751566962a5169a9c8efdf64d1ca00b',
      underlyingTokenAddress: '0x169bf778a5eadab0209c0524ea5ce8e7a616e33b', // Uniswap V2 INSUR/USDC LP
    },
  ];
}
