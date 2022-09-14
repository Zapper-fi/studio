import { Injectable } from '@nestjs/common';

import {
  AaveV2LendingTokenDataProps,
  AaveV2ReserveApyData,
  AaveV2ReserveTokenAddressesData,
} from '~apps/aave-v2/helpers/aave-v2.lending.template.token-fetcher';
import { GetDisplayPropsParams } from '~position/template/app-token.template.types';
import { Network } from '~types/network.interface';

import { AAVE_AMM_DEFINITION } from '../aave-amm.definition';
import { AaveAmmAToken } from '../contracts';
import { AaveAmmLendingTemplateTokenFetcher } from '../helpers/aave-amm.lending.template.token-fetcher';

@Injectable()
export class EthereumAaveAmmStableDebtTokenFetcher extends AaveAmmLendingTemplateTokenFetcher {
  appId = AAVE_AMM_DEFINITION.id;
  groupId = AAVE_AMM_DEFINITION.groups.stableDebt.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'Lending';
  providerAddress = '0x7937d4799803fbbe595ed57278bc4ca21f3bffcb';
  isDebt = true;

  getTokenAddress(reserveTokenAddressesData: AaveV2ReserveTokenAddressesData): string {
    return reserveTokenAddressesData.stableDebtTokenAddress;
  }

  getApyFromReserveData(reserveApyData: AaveV2ReserveApyData): number {
    return reserveApyData.stableBorrowApy;
  }

  async getTertiaryLabel({ appToken }: GetDisplayPropsParams<AaveAmmAToken, AaveV2LendingTokenDataProps>) {
    return `${(appToken.dataProps.apy * 100).toFixed(3)}% APR (stable)`;
  }
}
