import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { AngleAgtoken__factory } from './ethers';
import { AngleAngleToken__factory } from './ethers';
import { AnglePerpetualManager__factory } from './ethers';
import { AnglePoolManager__factory } from './ethers';
import { AngleSantoken__factory } from './ethers';
import { AngleStablemaster__factory } from './ethers';
import { AngleVaultManager__factory } from './ethers';
import { AngleVeangle__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class AngleContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  angleAgtoken({ address, network }: ContractOpts) {
    return AngleAgtoken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  angleAngleToken({ address, network }: ContractOpts) {
    return AngleAngleToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  anglePerpetualManager({ address, network }: ContractOpts) {
    return AnglePerpetualManager__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  anglePoolManager({ address, network }: ContractOpts) {
    return AnglePoolManager__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  angleSantoken({ address, network }: ContractOpts) {
    return AngleSantoken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  angleStablemaster({ address, network }: ContractOpts) {
    return AngleStablemaster__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  angleVaultManager({ address, network }: ContractOpts) {
    return AngleVaultManager__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  angleVeangle({ address, network }: ContractOpts) {
    return AngleVeangle__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { AngleAgtoken } from './ethers';
export type { AngleAngleToken } from './ethers';
export type { AnglePerpetualManager } from './ethers';
export type { AnglePoolManager } from './ethers';
export type { AngleSantoken } from './ethers';
export type { AngleStablemaster } from './ethers';
export type { AngleVaultManager } from './ethers';
export type { AngleVeangle } from './ethers';
