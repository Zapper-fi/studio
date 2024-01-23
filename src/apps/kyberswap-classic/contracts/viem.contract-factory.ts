import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  KyberSwapClassicFactory__factory,
  KyberSwapClassicMasterchef__factory,
  KyberSwapClassicMasterchefV2__factory,
  KyberSwapClassicPool__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class KyberswapClassicViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  kyberSwapClassicFactory({ address, network }: ContractOpts) {
    return KyberSwapClassicFactory__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  kyberSwapClassicMasterchef({ address, network }: ContractOpts) {
    return KyberSwapClassicMasterchef__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  kyberSwapClassicMasterchefV2({ address, network }: ContractOpts) {
    return KyberSwapClassicMasterchefV2__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  kyberSwapClassicPool({ address, network }: ContractOpts) {
    return KyberSwapClassicPool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
