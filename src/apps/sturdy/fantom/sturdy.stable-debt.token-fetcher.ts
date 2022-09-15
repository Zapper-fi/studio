import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AaveAmmAToken } from '~apps/aave-amm/contracts';
import { AaveAmmLendingTemplateTokenFetcher } from '~apps/aave-amm/helpers/aave-amm.lending.template.token-fetcher';
import {
  AaveV2LendingTokenDataProps,
  AaveV2ReserveApyData,
  AaveV2ReserveTokenAddressesData,
} from '~apps/aave-v2/helpers/aave-v2.lending.template.token-fetcher';
import { GetDisplayPropsParams } from '~position/template/app-token.template.types';

@PositionTemplate()
export class FantomSturdyStableDebtTokenFetcher extends AaveAmmLendingTemplateTokenFetcher {
  groupLabel = 'Lending';
  providerAddress = '0x7ff2520cd7b76e8c49b5db51505b842d665f3e9a';
  isDebt = true;

  getTokenAddress(reserveTokenAddressesData: AaveV2ReserveTokenAddressesData): string {
    return reserveTokenAddressesData.stableDebtTokenAddress;
  }

  getApy(reserveApyData: AaveV2ReserveApyData): number {
    return reserveApyData.stableBorrowApy;
  }

  async getTertiaryLabel({ appToken }: GetDisplayPropsParams<AaveAmmAToken, AaveV2LendingTokenDataProps>) {
    return `${(appToken.dataProps.apy * 100).toFixed(3)}% APR (stable)`;
  }
}
