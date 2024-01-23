import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetDisplayPropsParams } from '~position/template/app-token.template.types';

import {
  UwuLendLendingTokenFetcher,
  UwuLendReserveApyData,
  UwuLendReserveTokenAddressesData,
} from '../common/uwu-lend.lending.token-fetcher';
import { UwuLendUToken } from '../contracts/viem';

@PositionTemplate()
export class EthereumUwuLendSupplyTokenFetcher extends UwuLendLendingTokenFetcher {
  groupLabel = 'Lending';
  providerAddress = '0x2409af0251dcb89ee3dee572629291f9b087c668';
  isDebt = false;

  getTokenAddress(reserveTokenAddressesData: UwuLendReserveTokenAddressesData): string {
    return reserveTokenAddressesData.aTokenAddress;
  }

  getApyFromReserveData(reserveApyData: UwuLendReserveApyData): number {
    return reserveApyData.supplyApy;
  }

  async getTertiaryLabel({ appToken }: GetDisplayPropsParams<UwuLendUToken>) {
    return `${appToken.dataProps.apy.toFixed(3)}% APY`;
  }
}
