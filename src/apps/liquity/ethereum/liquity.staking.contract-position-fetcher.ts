import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { LiquityContractFactory, LiquityStaking } from '../contracts';
import { LIQUITY_DEFINITION } from '../liquity.definition';

const FARMS = [
  {
    address: '0x4f9fbb3f1e99b56e0fe2892e623ed36a76fc605d',
    stakedTokenAddress: '0x6dea81c8171d0ba574754ef6f8b412f2ed88c54d',
    rewardTokenAddresses: ['0x5f98805a4e8be255a32880fdec7f6728c6568ba0', ZERO_ADDRESS], // LUSD and ETH
  },
];

const appId = LIQUITY_DEFINITION.id;
const groupId = LIQUITY_DEFINITION.groups.staking.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumLiquityStakingContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(LiquityContractFactory) private readonly liquityContractFactory: LiquityContractFactory,
  ) {}

  async getPositions() {
    return this.appToolkit.helpers.singleStakingFarmContractPositionHelper.getContractPositions<LiquityStaking>({
      appId,
      groupId,
      network,
      dependencies: [],
      resolveFarmDefinitions: async () => FARMS,
      resolveFarmContract: ({ address, network }) => this.liquityContractFactory.liquityStaking({ address, network }),
      resolveIsActive: async () => true,
      resolveRois: async () => ({ dailyROI: 0, weeklyROI: 0, yearlyROI: 0 }),
    });
  }
}
