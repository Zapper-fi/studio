import { Register } from '~app-toolkit/decorators';
import { Network } from '~types/network.interface';

import { AAVE_V2_DEFINITION } from '../aave-v2.definition';
import {
  AaveV2ReserveApyData,
  AaveV2ReserveTokenAddressesData,
  AaveV2LendingTemplateTokenFetcher,
} from '../helpers/aave-v2.lending.template.token-fetcher';

const appId = AAVE_V2_DEFINITION.id;
const groupId = AAVE_V2_DEFINITION.groups.variableDebt.id;
const network = Network.POLYGON_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class PolygonAaveV2VariableDebtTokenFetcher extends AaveV2LendingTemplateTokenFetcher {
  appId = AAVE_V2_DEFINITION.id;
  groupId = AAVE_V2_DEFINITION.groups.variableDebt.id;
  network = Network.POLYGON_MAINNET;
  providerAddress = '0x7551b5d2763519d4e37e8b81929d336de671d46d';

  getTokenAddress(reserveTokenAddressesData: AaveV2ReserveTokenAddressesData): string {
    return reserveTokenAddressesData.variableDebtTokenAddress;
  }

  getApy(reserveApyData: AaveV2ReserveApyData): number {
    return reserveApyData.variableBorrowApy;
  }
}
