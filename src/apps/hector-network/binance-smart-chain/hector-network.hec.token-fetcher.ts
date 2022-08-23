import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { HectorNetworkContractFactory } from '../contracts';
import { HECTOR_NETWORK_DEFINITION } from '../hector-network.definition';

const appId = HECTOR_NETWORK_DEFINITION.id;
const groupId = HECTOR_NETWORK_DEFINITION.groups.hec.id;
const network = Network.BINANCE_SMART_CHAIN_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class BinanceSmartChainHectorNetworkHecTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(HectorNetworkContractFactory) private readonly hectorNetworkContractFactory: HectorNetworkContractFactory,
  ) {}

  async getPositions() {
    return ['0x638eebe886b0e9e7c6929e69490064a6c94d204d'] as any;
  }
}
