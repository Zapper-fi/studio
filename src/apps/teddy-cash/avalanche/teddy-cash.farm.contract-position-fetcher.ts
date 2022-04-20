import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { Register } from '~app-toolkit/decorators';
import { LiquityContractFactory, LiquityStaking } from '~apps/liquity/contracts';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { TEDDY_CASH_DEFINITION } from '../teddy-cash.definition';

const FARMS = [
  {
    address: '0xb4387d93b5a9392f64963cd44389e7d9d2e1053c',
    stakedTokenAddress: '0x094bd7B2D99711A1486FB94d4395801C6d0fdDcC',
    rewardTokenAddresses: ['0x4fbf0429599460D327BD5F55625E30E4fC066095', ZERO_ADDRESS], // TSD and AVAX
  },
];

const appId = TEDDY_CASH_DEFINITION.id;
const groupId = TEDDY_CASH_DEFINITION.groups.farm.id;
const network = Network.AVALANCHE_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class AvalancheTeddyCashFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(LiquityContractFactory)
    private readonly liquityContractFactory: LiquityContractFactory,
  ) {}

  async getPositions() {
    return this.appToolkit.helpers.singleStakingFarmContractPositionHelper.getContractPositions<LiquityStaking>({
      network,
      appId,
      groupId,
      dependencies: [],
      resolveFarmDefinitions: async () => FARMS,
      resolveFarmContract: ({ network, address }) => this.liquityContractFactory.liquityStaking({ address, network }),
      resolveIsActive: async () => true,
      resolveRois: async () => ({ dailyROI: 0, weeklyROI: 0, yearlyROI: 0 }),
    });
  }
}
