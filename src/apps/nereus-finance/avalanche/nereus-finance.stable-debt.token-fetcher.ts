import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { AaveV2LendingTokenHelper } from '~apps/aave-v2/helpers/aave-v2.lending.token-helper';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { NEREUS_FINANCE_DEFINITION } from '../nereus-finance.definition';

const appId = NEREUS_FINANCE_DEFINITION.id;
const groupId = NEREUS_FINANCE_DEFINITION.groups.stableDebt.id;
const network = Network.AVALANCHE_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class AvalancheNereusFinanceStableDebtTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(@Inject(AaveV2LendingTokenHelper) private readonly aaveV2LendingTokenHelper: AaveV2LendingTokenHelper) {}

  async getPositions() {
    return this.aaveV2LendingTokenHelper.getTokens({
      appId,
      groupId,
      network,
      isDebt: true,
      protocolDataProviderAddress: '0xec090929fbc1b285fc9b3c8ebb92fbc62f01d804',
      resolveTokenAddress: ({ reserveTokenAddressesData }) => reserveTokenAddressesData.stableDebtTokenAddress,
      resolveLendingRate: ({ reserveData }) => reserveData.stableBorrowRate,
      resolveLabel: ({ reserveToken }) => getLabelFromToken(reserveToken),
      resolveApyLabel: ({ apy }) => `${(apy * 100).toFixed(3)}% APR (stable)`,
    });
  }
}
