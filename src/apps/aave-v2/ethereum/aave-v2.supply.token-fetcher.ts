import { Register } from '~app-toolkit/decorators';
import { Network } from '~types/network.interface';

import { AAVE_V2_DEFINITION } from '../aave-v2.definition';
import {
  AaveAmmReserveApyData,
  AaveAmmReserveTokenAddressesData,
  AaveV2LendingTemplateTokenFetcher,
} from '../helpers/aave-v2.lending.template.token-fetcher';

const appId = AAVE_V2_DEFINITION.id;
const groupId = AAVE_V2_DEFINITION.groups.supply.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumAaveV2SupplyTokenFetcher extends AaveV2LendingTemplateTokenFetcher {
  appId = AAVE_V2_DEFINITION.id;
  groupId = AAVE_V2_DEFINITION.groups.supply.id;
  network = Network.ETHEREUM_MAINNET;
  providerAddress = '0x057835ad21a177dbdd3090bb1cae03eacf78fc6d';

  getTokenAddress(reserveTokenAddressesData: AaveAmmReserveTokenAddressesData): string {
    return reserveTokenAddressesData.aTokenAddress;
  }

  getApy(reserveApyData: AaveAmmReserveApyData): number {
    return reserveApyData.supplyApy;
  }
}
