import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { SturdyLendingTokenHelper } from '../helpers/sturdy.lending.token-helper';
import { STURDY_DEFINITION } from '../sturdy.definition';

const appId = STURDY_DEFINITION.id;
const groupId = STURDY_DEFINITION.groups.supply.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumSturdySupplyTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(@Inject(SturdyLendingTokenHelper) private readonly sturdyLendingTokenHelper: SturdyLendingTokenHelper) {}

  async getPositions() {
    return this.sturdyLendingTokenHelper.getPositions({
      appId,
      groupId,
      network,
      protocolDataProviderAddress: '0xa422ca380bd70eef876292839222159e41aaee17',
      resolveTokenAddress: ({ reserveTokenAddressesData }) => reserveTokenAddressesData.aTokenAddress,
      resolveLendingRate: ({ reserveData }) => reserveData.liquidityRate,
      resolveLabel: ({ reserveToken }) => getLabelFromToken(reserveToken),
      resolveApyLabel: ({ apy }) => `${(apy * 100).toFixed(3)}% APY`,
    });
  }
}
