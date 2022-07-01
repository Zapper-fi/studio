import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { MMfinanceCakeChef__factory } from './ethers';
import { MMfinanceChef__factory } from './ethers';
import { MMfinanceChefV2__factory } from './ethers';
import { MMfinanceIfoChef__factory } from './ethers';
import { MMfinancePair__factory } from './ethers';
import { MMfinanceSmartChef__factory } from './ethers';
import { MMfinanceSyrupCake__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class MMfinanceContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  MMfinanceCakeChef({ address, network }: ContractOpts) {
    return MMfinanceCakeChef__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  MMfinanceChef({ address, network }: ContractOpts) {
    return MMfinanceChef__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  MMfinanceChefV2({ address, network }: ContractOpts) {
    return MMfinanceChefV2__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  MMfinanceIfoChef({ address, network }: ContractOpts) {
    return MMfinanceIfoChef__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  MMfinancePair({ address, network }: ContractOpts) {
    return MMfinancePair__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  MMfinanceSmartChef({ address, network }: ContractOpts) {
    return MMfinanceSmartChef__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  MMfinanceSyrupCake({ address, network }: ContractOpts) {
    return MMfinanceSyrupCake__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { MMfinanceCakeChef } from './ethers';
export type { MMfinanceChef } from './ethers';
export type { MMfinanceChefV2 } from './ethers';
export type { MMfinanceIfoChef } from './ethers';
export type { MMfinancePair } from './ethers';
export type { MMfinanceSmartChef } from './ethers';
export type { MMfinanceSyrupCake } from './ethers';
