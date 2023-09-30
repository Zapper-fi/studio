import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import {
  AdminContract__factory,
  BorrowerOperations__factory,
  PriceFeed__factory,
  StabilityPool__factory,
  VesselManager__factory,
} from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class GravitaContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  adminContract({ address, network }: ContractOpts) {
    return AdminContract__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  borrowerOperations({ address, network }: ContractOpts) {
    return BorrowerOperations__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  priceFeed({ address, network }: ContractOpts) {
    return PriceFeed__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  stabilityPool({ address, network }: ContractOpts) {
    return StabilityPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  vesselManager({ address, network }: ContractOpts) {
    return VesselManager__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { AdminContract } from './ethers';
export type { BorrowerOperations } from './ethers';
export type { PriceFeed } from './ethers';
export type { StabilityPool } from './ethers';
export type { VesselManager } from './ethers';
