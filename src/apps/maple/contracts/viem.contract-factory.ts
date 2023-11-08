import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  MaplePool__factory,
  MaplePoolManager__factory,
  MapleRewards__factory,
  MapleWithdrawalManager__factory,
  MapleXMpl__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class MapleViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  maplePool({ address, network }: ContractOpts) {
    return MaplePool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  maplePoolManager({ address, network }: ContractOpts) {
    return MaplePoolManager__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  mapleRewards({ address, network }: ContractOpts) {
    return MapleRewards__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  mapleWithdrawalManager({ address, network }: ContractOpts) {
    return MapleWithdrawalManager__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  mapleXMpl({ address, network }: ContractOpts) {
    return MapleXMpl__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
