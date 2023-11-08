import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { SablierSalary__factory, SablierStream__factory, SablierStreamLegacy__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class SablierViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  sablierSalary({ address, network }: ContractOpts) {
    return SablierSalary__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  sablierStream({ address, network }: ContractOpts) {
    return SablierStream__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  sablierStreamLegacy({ address, network }: ContractOpts) {
    return SablierStreamLegacy__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
