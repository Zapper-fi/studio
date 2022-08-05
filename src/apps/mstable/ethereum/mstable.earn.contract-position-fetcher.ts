import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { BALANCER_V2_DEFINITION } from '~apps/balancer-v2';
import { SynthetixSingleStakingFarmContractPositionHelper } from '~apps/synthetix';
import { UNISWAP_V2_DEFINITION } from '~apps/uniswap-v2';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MSTABLE_DEFINITION } from '../mstable.definition';

const EARN_FARMS = [
  {
    address: '0x9b4aba35b35eee7481775ccb4055ce4e176c9a6f',
    stakedTokenAddress: '0x0d0d65e7a7db277d3e0f5e1676325e75f3340455', // UNI-V2 MTA / ETH
    rewardTokenAddresses: ['0xa3bed4e1c75d00fa6f4e5e6922db7261b5e9acd2'], // MTA
  },
  {
    address: '0x0d4cd2c24a4c9cd31fcf0d3c4682d234d9f94be4',
    stakedTokenAddress: '0x4019ba88158daa468a063ac48171a3bfe8cd9f3b', // BPT MTA 95 / mUSD 5
    rewardTokenAddresses: ['0xa3bed4e1c75d00fa6f4e5e6922db7261b5e9acd2'], // MTA
  },
  {
    address: '0x25970282aac735cd4c76f30bfb0bf2bc8dad4e70',
    stakedTokenAddress: '0x003a70265a3662342010823bea15dc84c6f7ed54', // BPT MTA 80 / mUSD 20
    rewardTokenAddresses: ['0xa3bed4e1c75d00fa6f4e5e6922db7261b5e9acd2'], // MTA
  },
  {
    address: '0x881c72d1e6317f10a1cdcbe05040e7564e790c80',
    stakedTokenAddress: '0x72cd8f4504941bf8c5a21d1fd83a96499fd71d2c', // BPT USDC 50 / mUSD 50
    rewardTokenAddresses: ['0xa3bed4e1c75d00fa6f4e5e6922db7261b5e9acd2'], // MTA
  },
  {
    address: '0xf4a7d2d85f4ba11b5c73c35e27044c0c49f7f027',
    stakedTokenAddress: '0xa5da8cc7167070b62fdcb332ef097a55a68d8824', // BPT MTA 5 / mUSD 95
    rewardTokenAddresses: ['0xa3bed4e1c75d00fa6f4e5e6922db7261b5e9acd2'], // MTA
  },
  {
    address: '0xf7575d4d4db78f6ba43c734616c51e9fd4baa7fb',
    stakedTokenAddress: '0xe036cce08cf4e23d33bc6b18e53caf532afa8513', // BPT mUSD 50 / WETH 50
    rewardTokenAddresses: ['0xa3bed4e1c75d00fa6f4e5e6922db7261b5e9acd2'], // MTA
  },
  {
    address: '0xe6e6e25efda5f69687aa9914f8d750c523a1d261',
    stakedTokenAddress: '0x1aef73d49dedc4b1778d0706583995958dc862e6', // Curve mUSD / 3Pool
    rewardTokenAddresses: ['0xa3bed4e1c75d00fa6f4e5e6922db7261b5e9acd2'], // MTA
  },
];

// Legacy; see https://earn.mstable.org/
const network = Network.ETHEREUM_MAINNET;
const groupId = MSTABLE_DEFINITION.groups.earn.id;
const appId = MSTABLE_DEFINITION.id;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumMstableEarnContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(SynthetixSingleStakingFarmContractPositionHelper)
    private readonly helper: SynthetixSingleStakingFarmContractPositionHelper,
  ) {}

  getPositions() {
    return this.helper.getContractPositions({
      appId,
      groupId,
      network,
      farmDefinitions: EARN_FARMS,
      dependencies: [
        {
          appId: UNISWAP_V2_DEFINITION.id,
          groupIds: [UNISWAP_V2_DEFINITION.groups.pool.id],
          network,
        },
        {
          appId: BALANCER_V2_DEFINITION.id,
          groupIds: [BALANCER_V2_DEFINITION.groups.pool.id],
          network,
        },
      ],
    });
  }
}
