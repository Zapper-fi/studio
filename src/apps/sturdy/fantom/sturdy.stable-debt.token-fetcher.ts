import { Injectable } from '@nestjs/common';

import { AaveAmmAToken } from '~apps/aave-amm/contracts';
import { AaveAmmLendingTemplateTokenFetcher } from '~apps/aave-amm/helpers/aave-amm.lending.template.token-fetcher';
import {
  AaveV2LendingTokenDataProps,
  AaveV2ReserveApyData,
  AaveV2ReserveTokenAddressesData,
} from '~apps/aave-v2/helpers/aave-v2.lending.template.token-fetcher';
import { GetDisplayPropsParams } from '~position/template/app-token.template.types';
import { Network } from '~types/network.interface';

import { STURDY_DEFINITION } from '../sturdy.definition';

@Injectable()
export class FantomSturdyStableDebtTokenFetcher extends AaveAmmLendingTemplateTokenFetcher {
  appId = STURDY_DEFINITION.id;
  groupId = STURDY_DEFINITION.groups.stableDebt.id;
  network = Network.FANTOM_OPERA_MAINNET;
  groupLabel = 'Lending';
  providerAddress = '0x7ff2520cd7b76e8c49b5db51505b842d665f3e9a';
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
