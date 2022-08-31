import { Register } from '~app-toolkit/decorators';
import { AaveAmmAToken } from '~apps/aave-amm/contracts';
import { AaveAmmLendingTemplateTokenFetcher } from '~apps/aave-amm/helpers/aave-amm.lending.template.token-fetcher';
import {
  AaveV2LendingTokenDataProps,
  AaveV2ReserveApyData,
  AaveV2ReserveTokenAddressesData,
} from '~apps/aave-v2/helpers/aave-v2.lending.template.token-fetcher';
import { GetDisplayPropsParams } from '~position/template/app-token.template.types';
import { Network } from '~types/network.interface';

import { STURDY_DEFINITION } from '../sturdy.definition';

const appId = STURDY_DEFINITION.id;
const groupId = STURDY_DEFINITION.groups.supply.id;
const network = Network.FANTOM_OPERA_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class FantomSturdySupplyTokenFetcher extends AaveAmmLendingTemplateTokenFetcher {
  appId = STURDY_DEFINITION.id;
  groupId = STURDY_DEFINITION.groups.supply.id;
  network = Network.FANTOM_OPERA_MAINNET;
  groupLabel = 'Lending';
  providerAddress = '0x7ff2520cd7b76e8c49b5db51505b842d665f3e9a';
  isDebt = false;

  getTokenAddress(reserveTokenAddressesData: AaveV2ReserveTokenAddressesData): string {
    return reserveTokenAddressesData.aTokenAddress;
  }

  getApy(reserveApyData: AaveV2ReserveApyData): number {
    return reserveApyData.supplyApy;
  }

  async getTertiaryLabel({ appToken }: GetDisplayPropsParams<AaveAmmAToken, AaveV2LendingTokenDataProps>) {
    return `${(appToken.dataProps.apy * 100).toFixed(3)}% APY`;
  }
}
