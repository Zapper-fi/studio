import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { RaftLiquiditation__factory, RaftPositionManager__factory, RaftToken__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class RaftViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  raftLiquiditation({ address, network }: ContractOpts) {
    return RaftLiquiditation__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  raftPositionManager({ address, network }: ContractOpts) {
    return RaftPositionManager__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  raftToken({ address, network }: ContractOpts) {
    return RaftToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
