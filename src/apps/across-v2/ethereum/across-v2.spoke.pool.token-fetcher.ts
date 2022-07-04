import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { ACROSS_V2_DEFINITION } from '../across-v2.definition';
import { ACROSS_V2_ETH_SPOKEPOOL_DEFINITION } from './across.pool.definitions';
import { AcrossPoolTokenHelper } from '../helpers/across.v2.pool.token-helper';

const appId = ACROSS_V2_DEFINITION.id;
const groupId = ACROSS_V2_DEFINITION.groups.pool.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network, options: { includeInTvl: true } })
export class EthereumAcrossV2SpokePoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(AcrossPoolTokenHelper) private readonly acrossPoolTokenHelper: AcrossPoolTokenHelper,
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
  ) {}

  async getPositions() {
    const definition = ACROSS_V2_ETH_SPOKEPOOL_DEFINITION;
    return this.acrossPoolTokenHelper.getPosition({network,definition});
  }
} 