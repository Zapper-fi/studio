import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { AcrossPoolV2TokenFetcher } from '../common/across.pool-v2.token-fetcher';

@PositionTemplate()
export class EthereumAcrossPoolV2TokenFetcher extends AcrossPoolV2TokenFetcher {
  groupLabel = 'Pools V2';
  hubAddress = '0xc186fa914353c44b2e33ebe05f21846f1048beda';

  poolDefinitions = [
    {
      address: '0x28f77208728b0a45cab24c4868334581fe86f95b',
      underlyingTokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // ETH/WETH
    },
    {
      address: '0xc9b09405959f63f72725828b5d449488b02be1ca',
      underlyingTokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // UDSC
    },
    {
      address: '0x4fabacac8c41466117d6a38f46d08ddd4948a0cb',
      underlyingTokenAddress: '0x6b175474e89094c44da98b954eedeac495271d0f', // DAI
    },
    {
      address: '0x59c1427c658e97a7d568541dac780b2e5c8affb4',
      underlyingTokenAddress: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', // WBTC
    },
    {
      address: '0x9306b6f45263f8cb6a18eff127313d10d06fccb5',
      underlyingTokenAddress: '0x42bbfa2e77757c645eeaad1655e0911a7553efbc', // BOBA
    },
    {
      address: '0xb9921d28466304103a233fcd071833e498f12853',
      underlyingTokenAddress: '0x04fa0d235c4abf4bcf4787af4cf447de572ef828', // UMA
    },
    {
      address: '0xb0c8fef534223b891d4a430e49537143829c4817',
      underlyingTokenAddress: '0x44108f0223a3c3028f5fe7aec7f9bb2e66bef82f', // ACX
    },
    {
      address: '0xfacd2ec4647df2cb758f684c2aaab56a93288f9e',
      underlyingTokenAddress: '0xba100000625a3754423978a60c9317c58a424e3d', // BALANCER
    },
  ];
}
