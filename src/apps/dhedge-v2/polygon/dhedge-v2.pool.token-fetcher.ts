import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { DhedgeV2ContractFactory } from '../contracts';
import { DHEDGE_V_2_DEFINITION } from '../dhedge-v2.definition';

const appId = DHEDGE_V_2_DEFINITION.id;
const groupId = DHEDGE_V_2_DEFINITION.groups.pool.id;
const network = Network.POLYGON_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class PolygonDhedgeV2PoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(DhedgeV2ContractFactory) private readonly dhedgeV2ContractFactory: DhedgeV2ContractFactory,
  ) {}

  async getPositions() {
    return [];
  }
}
