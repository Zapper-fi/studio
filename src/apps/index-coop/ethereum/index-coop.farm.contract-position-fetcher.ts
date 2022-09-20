import { Inject } from '@nestjs/common';

import { SingleStakingFarmContractPositionHelper } from '~app-toolkit';
import { Register } from '~app-toolkit/decorators';
import { SynthetixContractFactory, SynthetixRewards } from '~apps/synthetix';
import { UNISWAP_V2_DEFINITION } from '~apps/uniswap-v2';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { INDEX_COOP_DEFINITION } from '../index-coop.definition';

const FARMS = [
  // UNI-V2 DPI / ETH
  {
    address: '0x8f06fba4684b5e0988f215a47775bb611af0f986',
    stakedTokenAddress: '0x4d5ef58aac27d99935e5b6b4a6778ff292059991',
    rewardTokenAddresses: ['0x0954906da0bf32d5479e25f46056d22f08464cab'],
  },
  // UNI-V2 DPI / ETH
  {
    address: '0xb93b505ed567982e2b6756177ddd23ab5745f309',
    stakedTokenAddress: '0x4d5ef58aac27d99935e5b6b4a6778ff292059991',
    rewardTokenAddresses: ['0x0954906da0bf32d5479e25f46056d22f08464cab'],
  },
  // UNI-V2 MVI / ETH
  {
    address: '0x5bc4249641b4bf4e37ef513f3fa5c63ecab34881',
    stakedTokenAddress: '0x4d3c5db2c68f6859e0cd05d080979f597dd64bff',
    rewardTokenAddresses: ['0x0954906da0bf32d5479e25f46056d22f08464cab'],
  },
];

const appId = INDEX_COOP_DEFINITION.id;
const groupId = INDEX_COOP_DEFINITION.groups.farm.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumIndexCoopContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(SynthetixContractFactory)
    private readonly synthetixContractFactory: SynthetixContractFactory,
    @Inject(SingleStakingFarmContractPositionHelper)
    private readonly singleStakingFarmContractPositionHelper: SingleStakingFarmContractPositionHelper,
  ) {}

  async getPositions() {
    return this.singleStakingFarmContractPositionHelper.getContractPositions<SynthetixRewards>({
      appId,
      groupId,
      network,
      resolveFarmDefinitions: async () => FARMS,
      dependencies: [
        {
          appId: UNISWAP_V2_DEFINITION.id,
          groupIds: [UNISWAP_V2_DEFINITION.groups.pool.id],
          network,
        },
      ],
      resolveFarmContract: ({ address, network }) =>
        this.synthetixContractFactory.synthetixRewards({ address, network }),
      resolveIsActive: async () => true,
      resolveRois: async () => ({ dailyROI: 0, weeklyROI: 0, yearlyROI: 0 }),
    });
  }
}
