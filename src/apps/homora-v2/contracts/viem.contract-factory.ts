import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { CyToken__factory, HomoraBank__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class HomoraV2ViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  cyToken({ address, network }: ContractOpts) {
    return CyToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  homoraBank({ address, network }: ContractOpts) {
    return HomoraBank__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
