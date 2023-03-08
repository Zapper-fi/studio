import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import {
  MaplePool__factory,
  MaplePoolManager__factory,
  MapleRewards__factory,
  MapleWithdrawalManager__factory,
  MapleXMpl__factory,
} from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class MapleContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  maplePool({ address, network }: ContractOpts) {
    return MaplePool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  maplePoolManager({ address, network }: ContractOpts) {
    return MaplePoolManager__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  mapleRewards({ address, network }: ContractOpts) {
    return MapleRewards__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  mapleWithdrawalManager({ address, network }: ContractOpts) {
    return MapleWithdrawalManager__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  mapleXMpl({ address, network }: ContractOpts) {
    return MapleXMpl__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { MaplePool } from './ethers';
export type { MaplePoolManager } from './ethers';
export type { MapleRewards } from './ethers';
export type { MapleWithdrawalManager } from './ethers';
export type { MapleXMpl } from './ethers';
