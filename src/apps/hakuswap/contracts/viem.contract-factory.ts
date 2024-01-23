import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { HakuswapFactory__factory, HakuswapMasterchef__factory, HakuswapPool__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class HakuswapViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  hakuswapFactory({ address, network }: ContractOpts) {
    return HakuswapFactory__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  hakuswapMasterchef({ address, network }: ContractOpts) {
    return HakuswapMasterchef__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  hakuswapPool({ address, network }: ContractOpts) {
    return HakuswapPool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
