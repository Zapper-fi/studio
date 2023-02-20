import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import {
  KlimaBondDepository__factory,
  KlimaDistributor__factory,
  KlimaSKlima__factory,
  KlimaWsKlima__factory,
} from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class KlimaContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  klimaBondDepository({ address, network }: ContractOpts) {
    return KlimaBondDepository__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  klimaDistributor({ address, network }: ContractOpts) {
    return KlimaDistributor__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  klimaSKlima({ address, network }: ContractOpts) {
    return KlimaSKlima__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  klimaWsKlima({ address, network }: ContractOpts) {
    return KlimaWsKlima__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { KlimaBondDepository } from './ethers';
export type { KlimaDistributor } from './ethers';
export type { KlimaSKlima } from './ethers';
export type { KlimaWsKlima } from './ethers';
