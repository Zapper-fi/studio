import { Register } from '~app-toolkit/decorators';
import { AaveV2AToken } from '~apps/aave-v2/contracts/ethers/AaveV2AToken';
import {
  AaveV2LendingTemplateTokenFetcher,
  AaveV2LendingTokenDataProps,
  AaveV2ReserveApyData,
  AaveV2ReserveTokenAddressesData,
} from '~apps/aave-v2/helpers/aave-v2.lending.template.token-fetcher';
import { GetDisplayPropsStageParams } from '~position/template/app-token.template.types';
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
  groupLabel = 'Lending';
  providerAddress = '0x24dcbd376db23e4771375092344f5cbea3541fc0';
  isDebt = false;

  getTokenAddress(reserveTokenAddressesData: AaveV2ReserveTokenAddressesData): string {
    return reserveTokenAddressesData.aTokenAddress;
  }

  getApy(reserveApyData: AaveV2ReserveApyData): number {
    return reserveApyData.supplyApy;
  }

  async getTertiaryLabel({ appToken }: GetDisplayPropsStageParams<AaveV2AToken, AaveV2LendingTokenDataProps>) {
    return `${(appToken.dataProps.apy * 100).toFixed(3)}% APY`;
  }
}
