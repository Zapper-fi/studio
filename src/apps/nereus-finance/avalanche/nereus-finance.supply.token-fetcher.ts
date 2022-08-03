import { Register } from '~app-toolkit/decorators';
import {
  AaveV2LendingTemplateTokenFetcher,
  AaveV2ReserveApyData,
  AaveV2ReserveTokenAddressesData,
} from '~apps/aave-v2/helpers/aave-v2.lending.template.token-fetcher';
import { Network } from '~types/network.interface';

import { NEREUS_FINANCE_DEFINITION } from '../nereus-finance.definition';

const appId = NEREUS_FINANCE_DEFINITION.id;
const groupId = NEREUS_FINANCE_DEFINITION.groups.supply.id;
const network = Network.AVALANCHE_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class AvalancheNereusFinanceSupplyTokenFetcher extends AaveV2LendingTemplateTokenFetcher {
  appId = NEREUS_FINANCE_DEFINITION.id;
  groupId = NEREUS_FINANCE_DEFINITION.groups.supply.id;
  network = Network.AVALANCHE_MAINNET;
  providerAddress = '0xec090929fbc1b285fc9b3c8ebb92fbc62f01d804';

  getTokenAddress(reserveTokenAddressesData: AaveV2ReserveTokenAddressesData): string {
    return reserveTokenAddressesData.aTokenAddress;
  }

  getApy(reserveApyData: AaveV2ReserveApyData): number {
    return reserveApyData.supplyApy;
  }
}
