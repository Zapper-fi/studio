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
export class OptimismGranaryFinanceVariableDebtTokenFetcher extends AaveV2LendingTokenFetcher {
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
