import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { TempusContractFactory } from '../contracts';
import { TEMPUS_DEFINITION } from '../tempus.definition';

const appId = TEMPUS_DEFINITION.id;
const groupId = TEMPUS_DEFINITION.groups.pools.id;
const network = Network.FANTOM_OPERA_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class FantomTempusTokensTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(TempusContractFactory) private readonly tempusContractFactory: TempusContractFactory,
  ) { }

  async getPositions() {
    return [];
  }
}
