import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { Silo__factory, SiloIncentives__factory, SiloLens__factory, SiloMarketAsset__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class SiloFinanceContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  silo({ address, network }: ContractOpts) {
    return Silo__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  siloIncentives({ address, network }: ContractOpts) {
    return SiloIncentives__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  siloLens({ address, network }: ContractOpts) {
    return SiloLens__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  siloMarketAsset({ address, network }: ContractOpts) {
    return SiloMarketAsset__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { Silo } from './ethers';
export type { SiloIncentives } from './ethers';
export type { SiloLens } from './ethers';
export type { SiloMarketAsset } from './ethers';
