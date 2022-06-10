import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { AaveV2LendingTokenHelper } from '~apps/aave-v2/helpers/aave-v2.lending.token-helper';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { AGAVE_DEFINITION } from '../agave.definition';
import { AgaveContractFactory } from '../contracts';

const appId = AGAVE_DEFINITION.id;
const groupId = AGAVE_DEFINITION.groups.variableBorrow.id;
const network = Network.GNOSIS_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class GnosisAgaveVariableBorrowTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(AgaveContractFactory) private readonly agaveContractFactory: AgaveContractFactory,
    @Inject(AaveV2LendingTokenHelper)
    private readonly aaveV2LendingTokenHelper: AaveV2LendingTokenHelper,
  ) {}

  async getPositions() {
    return this.aaveV2LendingTokenHelper.getTokens({
      appId,
      groupId,
      network,
      protocolDataProviderAddress: '0x24dCbd376Db23e4771375092344f5CbEA3541FC0',
      resolveTokenAddress: ({ reserveTokenAddressesData }) => reserveTokenAddressesData.variableDebtTokenAddress,
      resolveLendingRate: ({ reserveData }) => reserveData.variableBorrowRate,
      resolveLabel: ({ reserveToken }) => `Borrowed ${getLabelFromToken(reserveToken)}`,
      resolveApyLabel: ({ apy }) => `${(apy * 100).toFixed(3)}% APR (variable)`,
    });
  }
}
