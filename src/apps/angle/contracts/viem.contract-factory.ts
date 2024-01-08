import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  AngleLiquidityGauge__factory,
  AnglePerpetualManager__factory,
  AnglePoolManager__factory,
  AngleStablemaster__factory,
  AngleVaultManager__factory,
  AngleVeAngle__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class AngleViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  angleLiquidityGauge({ address, network }: ContractOpts) {
    return AngleLiquidityGauge__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  anglePerpetualManager({ address, network }: ContractOpts) {
    return AnglePerpetualManager__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  anglePoolManager({ address, network }: ContractOpts) {
    return AnglePoolManager__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  angleStablemaster({ address, network }: ContractOpts) {
    return AngleStablemaster__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  angleVaultManager({ address, network }: ContractOpts) {
    return AngleVaultManager__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  angleVeAngle({ address, network }: ContractOpts) {
    return AngleVeAngle__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
