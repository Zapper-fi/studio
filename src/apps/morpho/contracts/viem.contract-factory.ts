import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  MorphoAToken__factory,
  MorphoAaveV2__factory,
  MorphoAaveV2Lens__factory,
  MorphoAaveV3__factory,
  MorphoCToken__factory,
  MorphoCompound__factory,
  MorphoCompoundLens__factory,
  Pool__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class MorphoViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  morphoAToken({ address, network }: ContractOpts) {
    return MorphoAToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  morphoAaveV2({ address, network }: ContractOpts) {
    return MorphoAaveV2__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  morphoAaveV2Lens({ address, network }: ContractOpts) {
    return MorphoAaveV2Lens__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  morphoAaveV3({ address, network }: ContractOpts) {
    return MorphoAaveV3__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  morphoCToken({ address, network }: ContractOpts) {
    return MorphoCToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  morphoCompound({ address, network }: ContractOpts) {
    return MorphoCompound__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  morphoCompoundLens({ address, network }: ContractOpts) {
    return MorphoCompoundLens__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  pool({ address, network }: ContractOpts) {
    return Pool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
