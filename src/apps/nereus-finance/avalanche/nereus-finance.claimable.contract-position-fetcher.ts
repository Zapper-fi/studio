import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { NereusFinanceClaimableContractPositionHelper } from '../helpers/nereus-finance.claimable.contract-position-helper';
import { NEREUS_FINANCE_DEFINITION } from '../nereus-finance.definition';

const appId = NEREUS_FINANCE_DEFINITION.id;
const groupId = NEREUS_FINANCE_DEFINITION.groups.claimable.id;
const network = Network.AVALANCHE_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class AvalancheNereusFinanceClaimableContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(NereusFinanceClaimableContractPositionHelper)
    private readonly nereusFinanceClaimableContractPositionHelper: NereusFinanceClaimableContractPositionHelper,
  ) {}

  async getPositions() {
    return this.nereusFinanceClaimableContractPositionHelper.getTokens({
      appId,
      groupId,
      network,
      incentivesControllerAddress: '0xa57a8C5dd29bd9CC605027E62935db2cB5485378',
      protocolDataProviderAddress: '0xec090929fBc1B285fc9b3c8EBB92fbc62F01D804',
      rewardTokenAddress: '0xfcde4a87b8b6fa58326bb462882f1778158b02f1',
    });
  }
}
