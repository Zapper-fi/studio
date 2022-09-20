import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  AaveV2LendingTokenDataProps,
  AaveV2ReserveApyData,
  AaveV2ReserveTokenAddressesData,
} from '~apps/aave-v2/helpers/aave-v2.lending.template.token-fetcher';
import { GetDisplayPropsParams } from '~position/template/app-token.template.types';

import { AaveAmmAToken } from '../contracts';
import { AaveAmmLendingTemplateTokenFetcher } from '../helpers/aave-amm.lending.template.token-fetcher';

@PositionTemplate()
export class EthereumAaveAmmSupplyTokenFetcher extends AaveAmmLendingTemplateTokenFetcher {
  groupLabel = 'Lending';
  providerAddress = '0x7937d4799803fbbe595ed57278bc4ca21f3bffcb';
  isDebt = false;

  getTokenAddress(reserveTokenAddressesData: AaveV2ReserveTokenAddressesData): string {
    return reserveTokenAddressesData.aTokenAddress;
  }

  getApyFromReserveData(reserveApyData: AaveV2ReserveApyData): number {
    return reserveApyData.supplyApy;
  }

  async getTertiaryLabel({ appToken }: GetDisplayPropsParams<AaveAmmAToken, AaveV2LendingTokenDataProps>) {
    return `${(appToken.dataProps.apy * 100).toFixed(3)}% APY`;
  }
}
