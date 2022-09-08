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

import { GEIST_DEFINITION } from '../geist.definition';

@Injectable()
export class FantomGeistStableDebtTokenFetcher extends AaveV2LendingTemplateTokenFetcher {
  appId = GEIST_DEFINITION.id;
  groupId = GEIST_DEFINITION.groups.stableDebt.id;
  network = Network.FANTOM_OPERA_MAINNET;
  groupLabel = 'Lending';
  providerAddress = '0xf3b0611e2e4d2cd6ab4bb3e01ade211c3f42a8c3';
  isDebt = true;

  getTokenAddress(reserveTokenAddressesData: AaveV2ReserveTokenAddressesData): string {
    return reserveTokenAddressesData.stableDebtTokenAddress;
  }

  getApy(reserveApyData: AaveV2ReserveApyData): number {
    return reserveApyData.stableBorrowApy;
  }

  async getTertiaryLabel({ appToken }: GetDisplayPropsParams<AaveV2AToken, AaveV2LendingTokenDataProps>) {
    return `${appToken.dataProps.apy.toFixed(3)}% APR (stable)`;
  }
}
