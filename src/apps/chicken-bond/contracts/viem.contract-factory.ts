import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  ChickenBondBlusd__factory,
  ChickenBondBondNft__factory,
  ChickenBondManager__factory,
  CurvePool__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class ChickenBondViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  chickenBondBlusd({ address, network }: ContractOpts) {
    return ChickenBondBlusd__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  chickenBondBondNft({ address, network }: ContractOpts) {
    return ChickenBondBondNft__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  chickenBondManager({ address, network }: ContractOpts) {
    return ChickenBondManager__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  curvePool({ address, network }: ContractOpts) {
    return CurvePool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
