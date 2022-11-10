import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MidasContractFactory } from '../contracts';
import { MIDAS_DEFINITION } from '../midas.definition';

const appId = MIDAS_DEFINITION.id;
const groupId = MIDAS_DEFINITION.groups.pool.id;
const network = Network.MOONRIVER_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class MoonriverMidasPoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(MidasContractFactory) private readonly midasContractFactory: MidasContractFactory,
  ) {}

  async getPositions() {
    return [];
  }
}
