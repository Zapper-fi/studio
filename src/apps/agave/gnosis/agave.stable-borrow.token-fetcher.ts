import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { AaveV2LendingTokenHelper } from '~apps/aave-v2/helpers/aave-v2.lending.token-helper';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { AGAVE_DEFINITION } from '../agave.definition';

const appId = AGAVE_DEFINITION.id;
const groupId = AGAVE_DEFINITION.groups.stableBorrow.id;
const network = Network.GNOSIS_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network, options: { includeInTvl: true } })
export class GnosisAgaveStableBorrowTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(@Inject(AaveV2LendingTokenHelper) private readonly aaveV2LendingTokenHelper: AaveV2LendingTokenHelper) {}

  async getPositions() {
    return this.aaveV2LendingTokenHelper.getTokens({
      appId,
      groupId,
      network,
      isDebt: true,
      protocolDataProviderAddress: '0x24dcbd376db23e4771375092344f5cbea3541fc0',
      resolveTokenAddress: ({ reserveTokenAddressesData }) => reserveTokenAddressesData.stableDebtTokenAddress,
      resolveLendingRate: ({ reserveData }) => reserveData.stableBorrowRate,
      resolveLabel: ({ reserveToken }) => getLabelFromToken(reserveToken),
      resolveApyLabel: ({ apy }) => `${(apy * 100).toFixed(3)}% APR (stable)`,
    });
  }
}
