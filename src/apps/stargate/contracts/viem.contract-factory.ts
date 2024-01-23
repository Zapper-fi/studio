import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  StargateChef__factory,
  StargateChefTime__factory,
  StargateFactory__factory,
  StargatePool__factory,
  StargateVe__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class StargateViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  stargateChef({ address, network }: ContractOpts) {
    return StargateChef__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  stargateChefTime({ address, network }: ContractOpts) {
    return StargateChefTime__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  stargateFactory({ address, network }: ContractOpts) {
    return StargateFactory__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  stargatePool({ address, network }: ContractOpts) {
    return StargatePool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  stargateVe({ address, network }: ContractOpts) {
    return StargateVe__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
