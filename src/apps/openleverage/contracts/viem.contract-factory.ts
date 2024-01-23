import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { OpenleverageFactory__factory, OpenleverageLpool__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class OpenleverageViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  openleverageFactory({ address, network }: ContractOpts) {
    return OpenleverageFactory__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  openleverageLpool({ address, network }: ContractOpts) {
    return OpenleverageLpool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
