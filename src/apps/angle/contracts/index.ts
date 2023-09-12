import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import {
  AngleLiquidityGauge__factory,
  AnglePerpetualManager__factory,
  AnglePoolManager__factory,
  AngleSanToken__factory,
  AngleStablemaster__factory,
  AngleVaultManager__factory,
  AngleVeAngle__factory,
} from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class AngleContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  angleLiquidityGauge({ address, network }: ContractOpts) {
    return AngleLiquidityGauge__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  anglePerpetualManager({ address, network }: ContractOpts) {
    return AnglePerpetualManager__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  anglePoolManager({ address, network }: ContractOpts) {
    return AnglePoolManager__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  angleSanToken({ address, network }: ContractOpts) {
    return AngleSanToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  angleStablemaster({ address, network }: ContractOpts) {
    return AngleStablemaster__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  angleVaultManager({ address, network }: ContractOpts) {
    return AngleVaultManager__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  angleVeAngle({ address, network }: ContractOpts) {
    return AngleVeAngle__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { AngleLiquidityGauge } from './ethers';
export type { AnglePerpetualManager } from './ethers';
export type { AnglePoolManager } from './ethers';
export type { AngleSanToken } from './ethers';
export type { AngleStablemaster } from './ethers';
export type { AngleVaultManager } from './ethers';
export type { AngleVeAngle } from './ethers';
