import { Register } from '~app-toolkit/decorators';
import { AaveV2AToken } from '~apps/aave-v2/contracts';
import {
  AaveV2LendingTemplateTokenFetcher,
  AaveV2LendingTokenDataProps,
  AaveV2ReserveApyData,
  AaveV2ReserveTokenAddressesData,
} from '~apps/aave-v2/helpers/aave-v2.lending.template.token-fetcher';
import { DisplayPropsStageParams } from '~position/template/app-token.template.position-fetcher';
import { Network } from '~types/network.interface';

import AGAVE_DEFINITION from '../agave.definition';

const appId = AGAVE_DEFINITION.id;
const groupId = AGAVE_DEFINITION.groups.variableBorrow.id;
const network = Network.GNOSIS_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class GnosisAgaveVariableBorrowTokenFetcher extends AaveV2LendingTemplateTokenFetcher {
  appId = AGAVE_DEFINITION.id;
  groupId = AGAVE_DEFINITION.groups.variableBorrow.id;
  network = Network.GNOSIS_MAINNET;
  groupLabel = 'Lending';
  providerAddress = '0x24dcbd376db23e4771375092344f5cbea3541fc0';
  isDebt = true;

  getTokenAddress(reserveTokenAddressesData: AaveV2ReserveTokenAddressesData): string {
    return reserveTokenAddressesData.variableDebtTokenAddress;
  }

  getApy(reserveApyData: AaveV2ReserveApyData): number {
    return reserveApyData.variableBorrowApy;
  }

  async getTertiaryLabel({ appToken }: DisplayPropsStageParams<AaveV2AToken, AaveV2LendingTokenDataProps>) {
    return `${(appToken.dataProps.apy * 100).toFixed(3)}% (variable)`;
  }
}
