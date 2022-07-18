import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { NereusFinanceLendingTokenHelper } from '../helpers/nereus-finance.lending.token-helper';
import { NEREUS_FINANCE_DEFINITION } from '../nereus-finance.definition';

const appId = NEREUS_FINANCE_DEFINITION.id;
const groupId = NEREUS_FINANCE_DEFINITION.groups.stableDebt.id;
const network = Network.AVALANCHE_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class AvalancheNereusFinanceStableDebtTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(NereusFinanceLendingTokenHelper)
    private readonly nereusFinanceLendingTokenHelper: NereusFinanceLendingTokenHelper,
  ) {}

  async getPositions() {
    return this.nereusFinanceLendingTokenHelper.getTokens({
      appId,
      groupId,
      network,
      isDebt: true,
      protocolDataProviderAddress: '0xec090929fBc1B285fc9b3c8EBB92fbc62F01D804',
      resolveTokenAddress: ({ reserveTokenAddressesData }) => reserveTokenAddressesData.stableDebtTokenAddress,
      resolveLendingRate: ({ reserveData }) => reserveData.stableBorrowRate,
      resolveLabel: ({ reserveToken }) => getLabelFromToken(reserveToken),
      resolveApyLabel: ({ apy }) => `${(apy * 100).toFixed(3)}% APR (stable)`,
    });
  }
}
