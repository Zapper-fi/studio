import { Register } from '~app-toolkit/decorators';
import { AaveAmmLendingTemplateTokenFetcher } from '~apps/aave-amm/helpers/aave-amm.lending.template.token-fetcher';
import {
  AaveV2ReserveApyData,
  AaveV2ReserveTokenAddressesData,
} from '~apps/aave-v2/helpers/aave-v2.lending.template.token-fetcher';
import { Network } from '~types/network.interface';

import { STURDY_DEFINITION } from '../sturdy.definition';

const appId = STURDY_DEFINITION.id;
const groupId = STURDY_DEFINITION.groups.stableDebt.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumSturdyStableDebtTokenFetcher extends AaveAmmLendingTemplateTokenFetcher {
  appId = STURDY_DEFINITION.id;
  groupId = STURDY_DEFINITION.groups.stableDebt.id;
  network = Network.ETHEREUM_MAINNET;
  providerAddress = '0xa422ca380bd70eef876292839222159e41aaee17';

  getTokenAddress(reserveTokenAddressesData: AaveV2ReserveTokenAddressesData): string {
    return reserveTokenAddressesData.stableDebtTokenAddress;
  }

  getApy(reserveApyData: AaveV2ReserveApyData): number {
    return reserveApyData.stableBorrowApy;
  }
}
