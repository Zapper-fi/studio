import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { InsuraceMiningTokenFetcher } from '../common/insurace.mining.token-fetcher';

@PositionTemplate()
export class AvalancheInsuraceMiningTokenFetcher extends InsuraceMiningTokenFetcher {
  groupLabel = 'Mining Pools';
  insurTokenAddress = '0x544c42fbb96b39b21df61cf322b5edc285ee7429';
  stakersPoolV2Address = '0xf851cbb9940f8baebd1d0eaf259335c108e9e893';

  governanceMiningPools = [
    {
      address: '0x563d10af7395db31f9b0030b39fc4e3ef2598fee',
      underlyingTokenAddress: '0x544c42fbb96b39b21df61cf322b5edc285ee7429', // INSUR
    },
  ];

  underwritingMiningPools = [
    {
      address: '0xdecafc91000d4d3802a0562a8fb896f29b6a7480',
      underlyingTokenAddress: ZERO_ADDRESS, // AVAX
    },
    {
      address: '0xa29b59a149f62d390dee27b144c0092ca7dbba96',
      underlyingTokenAddress: '0xd586e7f844cea2f87f50152665bcbc2c279d8d70', // DAI.e
    },
    {
      address: '0x5b9d6666398b86e2541b08b00468ae6434f79441',
      underlyingTokenAddress: '0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664', // USDC.e
    },
    {
      address: '0xdbbb520b40c7b7c6498dbd532aee5e28c62b3611',
      underlyingTokenAddress: '0xc7198437980c041c805a1edcba50c1ce5db95118', // USDT.e
    },
    {
      address: '0x22182ee443e109472fa3ff95311e4532ff5880f9',
      underlyingTokenAddress: '0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab', // WETH.e
    },
  ];

  liquidityMiningPools = [];
}
