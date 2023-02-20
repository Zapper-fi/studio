import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { KeeperJobManager__factory } from './ethers';
import { KeeperKlp__factory } from './ethers';
import { KeeperRedeemableToken__factory } from './ethers';
import { KeeperVest__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class KeeperContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  keeperJobManager({ address, network }: ContractOpts) {
    return KeeperJobManager__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  keeperKlp({ address, network }: ContractOpts) {
    return KeeperKlp__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  keeperRedeemableToken({ address, network }: ContractOpts) {
    return KeeperRedeemableToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  keeperVest({ address, network }: ContractOpts) {
    return KeeperVest__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { KeeperJobManager } from './ethers';
export type { KeeperKlp } from './ethers';
export type { KeeperRedeemableToken } from './ethers';
export type { KeeperVest } from './ethers';
