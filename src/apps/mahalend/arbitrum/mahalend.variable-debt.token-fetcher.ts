import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetDisplayPropsParams } from '~position/template/app-token.template.types';

import {
  MahalendReserveApyData,
  MahalendReserveTokenAddressesData,
  MahalendLendingTokenFetcher,
  MahalendLendingTokenDataProps,
} from '../common/mahalend.lending.token-fetcher';
import { MahalendAToken } from '../contracts/ethers/MahalendAToken';

@PositionTemplate()
export class ArbitrumMahalendVariableDebtTokenFetcher extends MahalendLendingTokenFetcher {
  groupLabel = 'Lending';
  providerAddress = '0xE76C1D2a7a56348574810e83D38c07D47f0641F3';
  isDebt = true; //condition

  getTokenAddress(reserveTokenAddressesData: MahalendReserveTokenAddressesData): string {
    return reserveTokenAddressesData.variableDebtTokenAddress;
  }

  getApyFromReserveData(reserveApyData: MahalendReserveApyData): number {
    return reserveApyData.variableBorrowApy;
  }

  async getTertiaryLabel({ appToken }: GetDisplayPropsParams<MahalendAToken, MahalendLendingTokenDataProps>) {
    return `${appToken.dataProps.apy.toFixed(3)}% APR (variable)`;
  }
}
