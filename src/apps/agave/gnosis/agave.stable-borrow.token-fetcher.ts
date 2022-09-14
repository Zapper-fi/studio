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

import AGAVE_DEFINITION from '../agave.definition';

@Injectable()
export class GnosisAgaveStableBorrowTokenFetcher extends AaveV2LendingTemplateTokenFetcher {
  appId = AGAVE_DEFINITION.id;
  groupId = AGAVE_DEFINITION.groups.stableBorrow.id;
  network = Network.GNOSIS_MAINNET;
  groupLabel = 'Lending';
  providerAddress = '0x24dcbd376db23e4771375092344f5cbea3541fc0';
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
