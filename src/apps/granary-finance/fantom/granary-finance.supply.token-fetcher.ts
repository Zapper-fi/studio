import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  AaveV2LendingTokenFetcher,
  AaveV2LendingTokenDataProps,
  AaveV2ReserveApyData,
  AaveV2ReserveTokenAddressesData,
} from '~apps/aave-v2/common/aave-v2.lending.token-fetcher';
import { AaveV2AToken } from '~apps/aave-v2/contracts/viem';
import { GetDisplayPropsParams } from '~position/template/app-token.template.types';

@PositionTemplate()
export class FantomGranaryFinanceSupplyTokenFetcher extends AaveV2LendingTokenFetcher {
  groupLabel = 'Lending';
  providerAddress = '0x3132870d08f736505ff13b19199be17629085072';
  isDebt = false;

  getTokenAddress(reserveTokenAddressesData: AaveV2ReserveTokenAddressesData): string {
    return reserveTokenAddressesData.aTokenAddress;
  }

  getApyFromReserveData(reserveApyData: AaveV2ReserveApyData): number {
    return reserveApyData.supplyApy;
  }

  async getTertiaryLabel({ appToken }: GetDisplayPropsParams<AaveV2AToken, AaveV2LendingTokenDataProps>) {
    return `${appToken.dataProps.apy.toFixed(3)}% APY`;
  }
}
