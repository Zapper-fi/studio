import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { SynthetixSingleStakingFarmContractPositionHelper } from '~apps/synthetix/helpers/synthetix.single-staking-farm-contract-position-helper';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { AELIN_DEFINITION } from '../aelin.definition';
import { AelinContractFactory } from '../contracts';

const FARMS = [
  {
    address: '0xfe757a40f3eda520845b339c698b321663986a4d',
    stakedTokenAddress: '0x61baadcf22d2565b0f471b291c475db5555e0b76',
    rewardTokenAddresses: ['0x61baadcf22d2565b0f471b291c475db5555e0b76'],
  },
  {
    address: '0x4aec980a0daef4905520a11b99971c7b9583f4f8',
    stakedTokenAddress: '0x665d8d87ac09bdbc1222b8b9e72ddcb82f76b54a',
    rewardTokenAddresses: ['0x61baadcf22d2565b0f471b291c475db5555e0b76'],
  },
];

const appId = AELIN_DEFINITION.id;
const groupId = AELIN_DEFINITION.groups.farm.id;
const network = Network.OPTIMISM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class OptimismAelinFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(AelinContractFactory) private readonly aelinContractFactory: AelinContractFactory,
    @Inject(SynthetixSingleStakingFarmContractPositionHelper)
    private readonly synthetixSingleStakingFarmContractPositionHelper: SynthetixSingleStakingFarmContractPositionHelper,
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
  ) {}

  async getPositions() {
    return this.synthetixSingleStakingFarmContractPositionHelper.getContractPositions({
      appId,
      groupId,
      network,
      dependencies: [{ appId: 'sorbet', groupIds: ['pool'], network }],
      farmDefinitions: FARMS,
    });
  }
}
