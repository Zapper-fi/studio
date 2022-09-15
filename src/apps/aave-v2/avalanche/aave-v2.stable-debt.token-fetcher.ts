import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetDisplayPropsParams } from '~position/template/app-token.template.types';

import { AaveV2AToken } from '../contracts/ethers/AaveV2AToken';
import {
  AaveV2ReserveApyData,
  AaveV2ReserveTokenAddressesData,
  AaveV2LendingTemplateTokenFetcher,
  AaveV2LendingTokenDataProps,
} from '../helpers/aave-v2.lending.template.token-fetcher';

@PositionTemplate()
export class AvalancheAaveV2StableDebtTokenFetcher extends AaveV2LendingTemplateTokenFetcher {
  groupLabel = 'Lending';
  providerAddress = '0x65285e9dfab318f57051ab2b139cccf232945451';
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
