import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetDisplayPropsParams } from '~position/template/app-token.template.types';

import {
  AaveV2ReserveApyData,
  AaveV2ReserveTokenAddressesData,
  AaveV2LendingTokenFetcher,
  AaveV2LendingTokenDataProps,
} from '../common/aave-v2.lending.token-fetcher';
import { AaveV2AToken } from '../contracts/viem/AaveV2AToken';

@PositionTemplate()
export class AvalancheAaveV2VariableDebtTokenFetcher extends AaveV2LendingTokenFetcher {
  groupLabel = 'Lending';
  providerAddress = '0x65285e9dfab318f57051ab2b139cccf232945451';
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
