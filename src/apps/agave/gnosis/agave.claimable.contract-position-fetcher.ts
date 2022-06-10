import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { AaveV2ClaimableContractPositionHelper } from '~apps/aave-v2/helpers/aave-v2.claimable.contract-position-helper';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { AGAVE_DEFINITION } from '../agave.definition';
import { AgaveContractFactory } from '../contracts';

const appId = AGAVE_DEFINITION.id;
const groupId = AGAVE_DEFINITION.groups.claimable.id;
const network = Network.GNOSIS_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class GnosisAgaveClaimableContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(AgaveContractFactory) private readonly agaveContractFactory: AgaveContractFactory,
    @Inject(AaveV2ClaimableContractPositionHelper)
    private readonly aaveV2ClaimableContractPositionHelper: AaveV2ClaimableContractPositionHelper,
  ) {}

  async getPositions() {
    return this.aaveV2ClaimableContractPositionHelper.getTokens({
      appId,
      groupId,
      network,
      incentivesControllerAddress: '0xfa255f5104f129B78f477e9a6D050a02f31A5D86',
      protocolDataProviderAddress: '0x24dCbd376Db23e4771375092344f5CbEA3541FC0',
      rewardTokenAddress: '0x3a97704a1b25f08aa230ae53b352e2e72ef52843',
    });
  }
}
