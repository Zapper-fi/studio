import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetDisplayPropsParams } from '~position/template/app-token.template.types';

import {
  UwuLendLendingTokenFetcher,
  UwuLendReserveApyData,
  UwuLendReserveTokenAddressesData,
} from '../common/uwu-lend.lending.token-fetcher';
import { UwuLendUToken } from '../contracts/viem';

@PositionTemplate()
export class EthereumUwuLendVariableDebtTokenFetcher extends UwuLendLendingTokenFetcher {
  groupLabel = 'Lending';
  providerAddress = '0x2409af0251dcb89ee3dee572629291f9b087c668';
  isDebt = true;

  getTokenAddress(reserveTokenAddressesData: UwuLendReserveTokenAddressesData): string {
    return reserveTokenAddressesData.variableDebtTokenAddress;
  }

  getApyFromReserveData(reserveApyData: UwuLendReserveApyData): number {
    return reserveApyData.variableBorrowApy;
  }

  async getTertiaryLabel({ appToken }: GetDisplayPropsParams<UwuLendUToken>) {
    return `${appToken.dataProps.apy.toFixed(3)}% APR (variable)`;
  }
}
