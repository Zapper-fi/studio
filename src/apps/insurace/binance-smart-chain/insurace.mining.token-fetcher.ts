import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { InsuraceMiningTokenFetcher } from '../common/insurace.mining.token-fetcher';

@PositionTemplate()
export class BinanceSmartChainInsuraceMiningTokenFetcher extends InsuraceMiningTokenFetcher {
  groupLabel = 'Mining Pools';
  insurTokenAddress = '0x3192ccddf1cdce4ff055ebc80f3f0231b86a7e30';
  stakersPoolV2Address = '0xd50e8ce9d5c1f5228bcc77e318907bb4960578ef';

  governanceMiningPools = [
    {
      address: '0xa5eb163588e25f6de18b9e164ba39daa6086f52b',
      underlyingTokenAddress: '0x3192ccddf1cdce4ff055ebc80f3f0231b86a7e30', // INSUR
    },
  ];

  underwritingMiningPools = [
    {
      address: '0x563d10af7395db31f9b0030b39fc4e3ef2598fee',
      underlyingTokenAddress: ZERO_ADDRESS, // BNB
    },
    {
      address: '0xdbbb520b40c7b7c6498dbd532aee5e28c62b3611',
      underlyingTokenAddress: '0xe9e7cea3dedca5984780bafc599bd69add087d56', // BUSD
    },
    {
      address: '0xf2ce369b6e2b96952741af463dddd7061f565946',
      underlyingTokenAddress: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d', // USDC
    },
    {
      address: '0x22182ee443e109472fa3ff95311e4532ff5880f9',
      underlyingTokenAddress: '0x55d398326f99059ff775485246999027b3197955', // USDT
    },
    {
      address: '0x5b9d6666398b86e2541b08b00468ae6434f79441',
      underlyingTokenAddress: '0x2170ed0880ac9a755fd29b2688956bd959f933f8', // ETH
    },
  ];

  liquidityMiningPools = [];
}
