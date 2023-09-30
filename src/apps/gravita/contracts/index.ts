import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { StabilityPool__factory, VesselManager__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class GravitaContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  stabilityPool({ address, network }: ContractOpts) {
    return StabilityPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  vesselManager({ address, network }: ContractOpts) {
    return VesselManager__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { StabilityPool } from './ethers';
export type { VesselManager } from './ethers';
