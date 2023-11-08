import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  RariFuseComptroller__factory,
  RariFusePoolLens__factory,
  RariFusePoolsDirectory__factory,
  RariFuseToken__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class RariFuseViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  rariFuseComptroller({ address, network }: ContractOpts) {
    return RariFuseComptroller__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  rariFusePoolLens({ address, network }: ContractOpts) {
    return RariFusePoolLens__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  rariFusePoolsDirectory({ address, network }: ContractOpts) {
    return RariFusePoolsDirectory__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  rariFuseToken({ address, network }: ContractOpts) {
    return RariFuseToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
