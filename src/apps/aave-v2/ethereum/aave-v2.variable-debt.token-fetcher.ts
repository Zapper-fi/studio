import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { AAVE_V2_DEFINITION } from '../aave-v2.definition';
import { AaveV2LendingTokenHelper } from '../helpers/aave-v2.lending.token-helper';

const appId = AAVE_V2_DEFINITION.id;
const groupId = AAVE_V2_DEFINITION.groups.variableDebt.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network, options: { includeInTvl: true } })
export class EthereumAaveV2VariableDebtTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(AaveV2LendingTokenHelper)
    private readonly aaveV2LendingTokenHelper: AaveV2LendingTokenHelper,
  ) {}

  async getPositions() {
    return await this.aaveV2LendingTokenHelper.getTokens({
      appId,
      groupId,
      network,
      isDebt: true,
      protocolDataProviderAddress: '0x057835ad21a177dbdd3090bb1cae03eacf78fc6d',
      resolveTokenAddress: ({ reserveTokenAddressesData }) => reserveTokenAddressesData.variableDebtTokenAddress,
      resolveLendingRate: ({ reserveData }) => reserveData.variableBorrowRate,
      resolveLabel: ({ reserveToken }) => `Borrowed ${getLabelFromToken(reserveToken)}`,
      resolveApyLabel: ({ apy }) => `${(apy * 100).toFixed(3)}% APR (variable)`,
    });
  }
}
