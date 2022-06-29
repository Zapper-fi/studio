import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { AaveV2ClaimableContractPositionHelper } from '~apps/aave-v2/helpers/aave-v2.claimable.contract-position-helper';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { AGAVE_DEFINITION } from '../agave.definition';

const appId = AGAVE_DEFINITION.id;
const groupId = AGAVE_DEFINITION.groups.claimable.id;
const network = Network.GNOSIS_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class GnosisAgaveClaimableContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(AaveV2ClaimableContractPositionHelper)
    private readonly aaveV2ClaimableContractPositionHelper: AaveV2ClaimableContractPositionHelper,
  ) {}

  async getPositions() {
    return this.aaveV2ClaimableContractPositionHelper.getTokens({
      appId,
      groupId,
      network,
      incentivesControllerAddress: '0xfa255f5104f129b78f477e9a6d050a02f31a5d86',
      protocolDataProviderAddress: '0x24dcbd376db23e4771375092344f5cbea3541fc0',
      rewardTokenAddress: '0x3a97704a1b25f08aa230ae53b352e2e72ef52843',
    });
  }
}
