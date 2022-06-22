import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { ARRAKIS_DEFINITION } from '~apps/arrakis/arrakis.definition';
import { SynthetixSingleStakingFarmContractPositionHelper } from '~apps/synthetix/helpers/synthetix.single-staking-farm-contract-position-helper';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { AELIN_DEFINITION } from '../aelin.definition';

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
    @Inject(SynthetixSingleStakingFarmContractPositionHelper)
    private readonly synthetixSingleStakingFarmContractPositionHelper: SynthetixSingleStakingFarmContractPositionHelper,
  ) {}

  async getPositions() {
    return this.synthetixSingleStakingFarmContractPositionHelper.getContractPositions({
      appId,
      groupId,
      network,
      dependencies: [{ appId: ARRAKIS_DEFINITION.id, groupIds: [ARRAKIS_DEFINITION.groups.pool.id], network }],
      farmDefinitions: FARMS,
    });
  }
}
