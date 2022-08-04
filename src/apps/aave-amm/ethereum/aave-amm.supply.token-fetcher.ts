import { Register } from '~app-toolkit/decorators';
import {
  AaveV2LendingTokenDataProps,
  AaveV2ReserveApyData,
  AaveV2ReserveTokenAddressesData,
} from '~apps/aave-v2/helpers/aave-v2.lending.template.token-fetcher';
import { DisplayPropsStageParams } from '~position/template/app-token.template.position-fetcher';
import { Network } from '~types/network.interface';

import { AAVE_AMM_DEFINITION } from '../aave-amm.definition';
import { AaveAmmAToken } from '../contracts';
import { AaveAmmLendingTemplateTokenFetcher } from '../helpers/aave-amm.lending.template.token-fetcher';

const appId = AAVE_AMM_DEFINITION.id;
const groupId = AAVE_AMM_DEFINITION.groups.supply.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumAaveAmmSupplyTokenFetcher extends AaveAmmLendingTemplateTokenFetcher {
  appId = AAVE_AMM_DEFINITION.id;
  groupId = AAVE_AMM_DEFINITION.groups.supply.id;
  network = Network.ETHEREUM_MAINNET;
  providerAddress = '0x7937d4799803fbbe595ed57278bc4ca21f3bffcb';

  getTokenAddress(reserveTokenAddressesData: AaveV2ReserveTokenAddressesData): string {
    return reserveTokenAddressesData.aTokenAddress;
  }

  getApy(reserveApyData: AaveV2ReserveApyData): number {
    return reserveApyData.supplyApy;
  }

  async getTertiaryLabel({ appToken }: DisplayPropsStageParams<AaveAmmAToken, AaveV2LendingTokenDataProps>) {
    return `${(appToken.dataProps.apy * 100).toFixed(3)}% APY`;
  }
}
