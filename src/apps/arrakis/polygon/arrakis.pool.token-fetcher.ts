import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { ARRAKIS_DEFINITION } from '../arrakis.definition';
import { ArrakisPoolTokenHelper } from '../helpers/arrakis.pool.token-helper';

const appId = ARRAKIS_DEFINITION.id;
const groupId = ARRAKIS_DEFINITION.groups.pool.id;
const network = Network.POLYGON_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class PolygonArrakisPoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(@Inject(ArrakisPoolTokenHelper) private readonly arrakisPoolTokenHelper: ArrakisPoolTokenHelper) {}

  async getPositions() {
    return this.arrakisPoolTokenHelper.getPositions({
      subgraphUrl: 'https://api.thegraph.com/subgraphs/name/gelatodigital/g-uni-polygon',
      network,
    });
  }
}
