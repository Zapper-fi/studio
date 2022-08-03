import { Register } from '~app-toolkit/decorators';
import { Network } from '~types/network.interface';

import { AAVE_V2_DEFINITION } from '../aave-v2.definition';
import {
  AaveV2ReserveApyData,
  AaveV2ReserveTokenAddressesData,
  AaveV2LendingTemplateTokenFetcher,
} from '../helpers/aave-v2.lending.template.token-fetcher';

const appId = AAVE_V2_DEFINITION.id;
const groupId = AAVE_V2_DEFINITION.groups.stableDebt.id;
const network = Network.AVALANCHE_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class AvalancheAaveV2StableDebtTokenFetcher extends AaveV2LendingTemplateTokenFetcher {
  appId = AAVE_V2_DEFINITION.id;
  groupId = AAVE_V2_DEFINITION.groups.stableDebt.id;
  network = Network.AVALANCHE_MAINNET;
  providerAddress = '0x65285e9dfab318f57051ab2b139cccf232945451';

  getTokenAddress(reserveTokenAddressesData: AaveV2ReserveTokenAddressesData): string {
    return reserveTokenAddressesData.stableDebtTokenAddress;
  }

  getApy(reserveApyData: AaveV2ReserveApyData): number {
    return reserveApyData.stableBorrowApy;
  }
}
