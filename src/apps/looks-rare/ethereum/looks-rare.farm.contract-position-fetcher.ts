import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { SingleStakingFarmContractPositionHelper } from '~app-toolkit/helpers/position/single-staking-farm.contract-position-helper';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { LooksRareContractFactory, LooksRareFeeSharing } from '../contracts';
import { LOOKS_RARE_DEFINITION } from '../looks-rare.definition';

const FARMS = [
  {
    address: '0xbcd7254a1d759efa08ec7c3291b2e85c5dcc12ce',
    stakedTokenAddress: '0xf4d2888d29d722226fafa5d9b24f9164c092421e',
    rewardTokenAddresses: ['0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'],
  },
];

const appId = LOOKS_RARE_DEFINITION.id;
const groupId = LOOKS_RARE_DEFINITION.groups.farm.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumLooksRareFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(SingleStakingFarmContractPositionHelper)
    private readonly singleStakingFarmContractPositionHelper: SingleStakingFarmContractPositionHelper,
    @Inject(LooksRareContractFactory)
    private readonly looksRareContractFactory: LooksRareContractFactory,
  ) {}

  async getPositions() {
    return this.singleStakingFarmContractPositionHelper.getContractPositions<LooksRareFeeSharing>({
      network: Network.ETHEREUM_MAINNET,
      appId: LOOKS_RARE_DEFINITION.id,
      groupId: LOOKS_RARE_DEFINITION.groups.farm.id,
      resolveFarmDefinitions: async () => FARMS,
      resolveFarmContract: ({ address, network }) =>
        this.looksRareContractFactory.looksRareFeeSharing({ address, network }),
      resolveIsActive: async () => true,
      resolveRois: async () => ({ dailyROI: 0, weeklyROI: 0, yearlyROI: 0 }),
    });
  }
}
