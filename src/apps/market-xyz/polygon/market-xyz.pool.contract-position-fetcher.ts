import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MarketXyzContractFactory } from '../contracts';
import { MARKET_XYZ_DEFINITION } from '../market-xyz.definition';

const appId = MARKET_XYZ_DEFINITION.id;
const groupId = MARKET_XYZ_DEFINITION.groups.pool.id;
const network = Network.POLYGON_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class PolygonMarketXyzPoolContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(MarketXyzContractFactory) private readonly marketXyzContractFactory: MarketXyzContractFactory,
  ) { }

  async getPositions() {
    return [];
  }
}
