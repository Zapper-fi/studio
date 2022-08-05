import { Register } from '~app-toolkit/decorators';
import {
  AaveV2LendingTokenDataProps,
  AaveV2ReserveApyData,
  AaveV2ReserveTokenAddressesData,
} from '~apps/aave-v2/helpers/aave-v2.lending.template.token-fetcher';
import { BALANCER_V1_DEFINITION } from '~apps/balancer-v1';
import { UNISWAP_V2_DEFINITION } from '~apps/uniswap-v2';
import { DisplayPropsStageParams } from '~position/template/app-token.template.position-fetcher';
import { Network } from '~types/network.interface';

import { AAVE_AMM_DEFINITION } from '../aave-amm.definition';
import { AaveAmmAToken } from '../contracts';
import { AaveAmmLendingTemplateTokenFetcher } from '../helpers/aave-amm.lending.template.token-fetcher';

const appId = AAVE_AMM_DEFINITION.id;
const groupId = AAVE_AMM_DEFINITION.groups.stableDebt.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumAaveAmmStableDebtTokenFetcher extends AaveAmmLendingTemplateTokenFetcher {
  appId = AAVE_AMM_DEFINITION.id;
  groupId = AAVE_AMM_DEFINITION.groups.stableDebt.id;
  network = Network.ETHEREUM_MAINNET;
  providerAddress = '0x7937d4799803fbbe595ed57278bc4ca21f3bffcb';
  isDebt = true;
  dependencies = [
    { appId: BALANCER_V1_DEFINITION.id, groupIds: [BALANCER_V1_DEFINITION.groups.pool.id], network },
    { appId: UNISWAP_V2_DEFINITION.id, groupIds: [UNISWAP_V2_DEFINITION.groups.pool.id], network },
  ];

  getTokenAddress(reserveTokenAddressesData: AaveV2ReserveTokenAddressesData): string {
    return reserveTokenAddressesData.stableDebtTokenAddress;
  }

  getApy(reserveApyData: AaveV2ReserveApyData): number {
    return reserveApyData.stableBorrowApy;
  }

  async getTertiaryLabel({ appToken }: DisplayPropsStageParams<AaveAmmAToken, AaveV2LendingTokenDataProps>) {
    return `${(appToken.dataProps.apy * 100).toFixed(3)}% APR (stable)`;
  }
}
