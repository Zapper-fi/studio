import { Register } from '~app-toolkit/decorators';
import {
  AaveV2LendingTokenDataProps,
  AaveV2ReserveApyData,
  AaveV2ReserveTokenAddressesData,
} from '~apps/aave-v2/helpers/aave-v2.lending.template.token-fetcher';
import { GetDisplayPropsStageParams } from '~position/template/app-token.template.types';
import { Network } from '~types/network.interface';

import { AAVE_AMM_DEFINITION } from '../aave-amm.definition';
import { AaveAmmAToken } from '../contracts';
import { AaveAmmLendingTemplateTokenFetcher } from '../helpers/aave-amm.lending.template.token-fetcher';

const appId = AAVE_AMM_DEFINITION.id;
const groupId = AAVE_AMM_DEFINITION.groups.variableDebt.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumAaveAmmVariableDebtTokenFetcher extends AaveAmmLendingTemplateTokenFetcher {
  appId = AAVE_AMM_DEFINITION.id;
  groupId = AAVE_AMM_DEFINITION.groups.variableDebt.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'Lending';
  providerAddress = '0x7937d4799803fbbe595ed57278bc4ca21f3bffcb';
  isDebt = true;

  getTokenAddress(reserveTokenAddressesData: AaveV2ReserveTokenAddressesData): string {
    return reserveTokenAddressesData.variableDebtTokenAddress;
  }

  getApy(reserveApyData: AaveV2ReserveApyData): number {
    return reserveApyData.variableBorrowApy;
  }

  async getTertiaryLabel({ appToken }: GetDisplayPropsStageParams<AaveAmmAToken, AaveV2LendingTokenDataProps>) {
    return `${(appToken.dataProps.apy * 100).toFixed(3)}% APR (variable)`;
  }
}
