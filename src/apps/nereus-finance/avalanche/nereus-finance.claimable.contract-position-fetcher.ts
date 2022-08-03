import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { AaveV2ClaimableContractPositionHelper } from '~apps/aave-v2/helpers/aave-v2.claimable.contract-position-helper';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { NEREUS_FINANCE_DEFINITION } from '../nereus-finance.definition';

const appId = NEREUS_FINANCE_DEFINITION.id;
const groupId = NEREUS_FINANCE_DEFINITION.groups.claimable.id;
const network = Network.AVALANCHE_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class AvalancheNereusFinanceClaimableContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(AaveV2ClaimableContractPositionHelper)
    private readonly aaveV2ClaimableContractPositionHelper: AaveV2ClaimableContractPositionHelper,
  ) {}

  async getPositions() {
    return this.aaveV2ClaimableContractPositionHelper.getTokens({
      appId,
      groupId,
      network,
      incentivesControllerAddress: '0xa57a8c5dd29bd9cc605027e62935db2cb5485378',
      protocolDataProviderAddress: '0xec090929fbc1b285fc9b3c8ebb92fbc62f01d804',
      rewardTokenAddress: '0xfcde4a87b8b6fa58326bb462882f1778158b02f1',
    });
  }
}
