import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  KeeperJobManager__factory,
  KeeperKlp__factory,
  KeeperRedeemableToken__factory,
  KeeperVest__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class KeeperViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  keeperJobManager({ address, network }: ContractOpts) {
    return KeeperJobManager__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  keeperKlp({ address, network }: ContractOpts) {
    return KeeperKlp__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  keeperRedeemableToken({ address, network }: ContractOpts) {
    return KeeperRedeemableToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  keeperVest({ address, network }: ContractOpts) {
    return KeeperVest__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
