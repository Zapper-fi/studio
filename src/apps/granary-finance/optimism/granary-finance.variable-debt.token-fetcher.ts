import { Injectable } from '@nestjs/common';

import { AaveV2AToken } from '~apps/aave-v2/contracts';
import {
  AaveV2LendingTemplateTokenFetcher,
  AaveV2LendingTokenDataProps,
  AaveV2ReserveApyData,
  AaveV2ReserveTokenAddressesData,
} from '~apps/aave-v2/helpers/aave-v2.lending.template.token-fetcher';
import { GetDisplayPropsParams } from '~position/template/app-token.template.types';
import { Network } from '~types/network.interface';

import { GRANARY_FINANCE_DEFINITION } from '../granary-finance.definition';

@Injectable()
export class OptimismGranaryFinanceVariableDebtTokenFetcher extends AaveV2LendingTemplateTokenFetcher {
  appId = GRANARY_FINANCE_DEFINITION.id;
  groupId = GRANARY_FINANCE_DEFINITION.groups.variableDebt.id;
  network = Network.OPTIMISM_MAINNET;
  groupLabel = 'Lending';
  providerAddress = '0x9546f673ef71ff666ae66d01fd6e7c6dae5a9995';
  isDebt = true;

  getTokenAddress(reserveTokenAddressesData: AaveV2ReserveTokenAddressesData): string {
    return reserveTokenAddressesData.variableDebtTokenAddress;
  }

  getApyFromReserveData(reserveApyData: AaveV2ReserveApyData): number {
    return reserveApyData.variableBorrowApy;
  }

  async getTertiaryLabel({ appToken }: GetDisplayPropsParams<AaveV2AToken, AaveV2LendingTokenDataProps>) {
    return `${appToken.dataProps.apy.toFixed(3)}% APR (variable)`;
  }
}
