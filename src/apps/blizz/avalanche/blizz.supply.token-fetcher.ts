import { Register } from '~app-toolkit/decorators';
import {
  AaveV2LendingTemplateTokenFetcher,
  AaveV2ReserveApyData,
  AaveV2ReserveTokenAddressesData,
} from '~apps/aave-v2/helpers/aave-v2.lending.template.token-fetcher';
import { Network } from '~types/network.interface';

import { BLIZZ_DEFINITION } from '../blizz.definition';

const appId = BLIZZ_DEFINITION.id;
const groupId = BLIZZ_DEFINITION.groups.supply.id;
const network = Network.AVALANCHE_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class AvalancheBlizzSupplyTokenFetcher extends AaveV2LendingTemplateTokenFetcher {
  appId = BLIZZ_DEFINITION.id;
  groupId = BLIZZ_DEFINITION.groups.supply.id;
  network = Network.AVALANCHE_MAINNET;
  providerAddress = '0x51d1e664a3b247782ac95b30a7a3cde8c8d8ad5d';

  getTokenAddress(reserveTokenAddressesData: AaveV2ReserveTokenAddressesData): string {
    return reserveTokenAddressesData.aTokenAddress;
  }

  getApy(reserveApyData: AaveV2ReserveApyData): number {
    return reserveApyData.supplyApy;
  }
}
