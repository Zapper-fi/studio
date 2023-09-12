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
export class EthereumMahalendVariableDebtTokenFetcher extends MahalendLendingTokenFetcher {
  groupLabel = 'Lending';
  providerAddress = '0xCB5a1D4a394C4BA58999FbD7629d64465DdA70BC';
  isDebt = true;

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
