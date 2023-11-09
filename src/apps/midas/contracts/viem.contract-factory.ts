import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { MidasCErc20Token__factory, MidasPoolDirectory__factory, MidasPoolLens__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class MidasViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  midasCErc20Token({ address, network }: ContractOpts) {
    return MidasCErc20Token__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  midasPoolDirectory({ address, network }: ContractOpts) {
    return MidasPoolDirectory__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  midasPoolLens({ address, network }: ContractOpts) {
    return MidasPoolLens__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
