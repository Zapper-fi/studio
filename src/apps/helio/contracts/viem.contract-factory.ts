import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { HelioJar__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class HelioViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  helioJar({ address, network }: ContractOpts) {
    return HelioJar__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
