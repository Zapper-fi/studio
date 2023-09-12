import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { RaftLiquiditation__factory, RaftPositionManager__factory, RaftToken__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class RaftContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  raftLiquiditation({ address, network }: ContractOpts) {
    return RaftLiquiditation__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  raftPositionManager({ address, network }: ContractOpts) {
    return RaftPositionManager__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  raftToken({ address, network }: ContractOpts) {
    return RaftToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { RaftLiquiditation } from './ethers';
export type { RaftPositionManager } from './ethers';
export type { RaftToken } from './ethers';
