import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { MidasContractFactory } from '~apps/midas/contracts';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MIDAS_DEFINITION } from '../midas.definition';

const appId = MIDAS_DEFINITION.id;
const groupId = MIDAS_DEFINITION.groups.pool.id;
const network = Network.BINANCE_SMART_CHAIN_MAINNET;
const address = '0x82edcfe00bd0ce1f3ab968af09d04266bc092e0e';

@Register.TokenPositionFetcher({ appId, groupId, network })
export class BinanceSmartChainMidasPoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(MidasContractFactory) private readonly midasContractFactory: MidasContractFactory,
  ) {}

  async getPositions() {
    const allPools = await this.midasContractFactory.midasPoolDirectory({ address, network }).getAllPools();

    return allPools;
  }
}
