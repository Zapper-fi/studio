import { Register } from '~app-toolkit/decorators';
import {
  AaveV2LendingTemplateTokenFetcher,
  AaveV2ReserveApyData,
  AaveV2ReserveTokenAddressesData,
} from '~apps/aave-v2/helpers/aave-v2.lending.template.token-fetcher';
import { Network } from '~types/network.interface';

import AGAVE_DEFINITION from '../agave.definition';

const appId = AGAVE_DEFINITION.id;
const groupId = AGAVE_DEFINITION.groups.deposit.id;
const network = Network.GNOSIS_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class GnosisAgaveDepositTokenFetcher extends AaveV2LendingTemplateTokenFetcher {
  appId = AGAVE_DEFINITION.id;
  groupId = AGAVE_DEFINITION.groups.deposit.id;
  network = Network.GNOSIS_MAINNET;
  providerAddress = '0x24dcbd376db23e4771375092344f5cbea3541fc0';

  getTokenAddress(reserveTokenAddressesData: AaveV2ReserveTokenAddressesData): string {
    return reserveTokenAddressesData.aTokenAddress;
  }

  getApy(reserveApyData: AaveV2ReserveApyData): number {
    return reserveApyData.supplyApy;
  }
}
