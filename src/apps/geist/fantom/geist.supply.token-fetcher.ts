import { Register } from '~app-toolkit/decorators';
import { AaveV2AToken } from '~apps/aave-v2/contracts';
import {
  AaveV2LendingTemplateTokenFetcher,
  AaveV2LendingTokenDataProps,
  AaveV2ReserveApyData,
  AaveV2ReserveTokenAddressesData,
} from '~apps/aave-v2/helpers/aave-v2.lending.template.token-fetcher';
import { DisplayPropsStageParams } from '~position/template/app-token.template.position-fetcher';
import { Network } from '~types/network.interface';

import { GEIST_DEFINITION } from '../geist.definition';

const appId = GEIST_DEFINITION.id;
const groupId = GEIST_DEFINITION.groups.supply.id;
const network = Network.FANTOM_OPERA_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class FantomGeistSupplyTokenFetcher extends AaveV2LendingTemplateTokenFetcher {
  appId = GEIST_DEFINITION.id;
  groupId = GEIST_DEFINITION.groups.supply.id;
  network = Network.FANTOM_OPERA_MAINNET;
  groupLabel = 'Lending';
  providerAddress = '0xf3b0611e2e4d2cd6ab4bb3e01ade211c3f42a8c3';
  isDebt = false;

  getTokenAddress(reserveTokenAddressesData: AaveV2ReserveTokenAddressesData): string {
    return reserveTokenAddressesData.aTokenAddress;
  }

  getApy(reserveApyData: AaveV2ReserveApyData): number {
    return reserveApyData.supplyApy;
  }

  async getTertiaryLabel({ appToken }: DisplayPropsStageParams<AaveV2AToken, AaveV2LendingTokenDataProps>) {
    return `${(appToken.dataProps.apy * 100).toFixed(3)}% APY`;
  }
}
