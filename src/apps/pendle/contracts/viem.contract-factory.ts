import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  PendleData__factory,
  PendleDexFactory__factory,
  PendleDexPair__factory,
  PendleForge__factory,
  PendleMarket__factory,
  PendleOwnershipToken__factory,
  PendleStaking__factory,
  PendleStakingManager__factory,
  PendleYieldToken__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class PendleViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  pendleData({ address, network }: ContractOpts) {
    return PendleData__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  pendleDexFactory({ address, network }: ContractOpts) {
    return PendleDexFactory__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  pendleDexPair({ address, network }: ContractOpts) {
    return PendleDexPair__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  pendleForge({ address, network }: ContractOpts) {
    return PendleForge__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  pendleMarket({ address, network }: ContractOpts) {
    return PendleMarket__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  pendleOwnershipToken({ address, network }: ContractOpts) {
    return PendleOwnershipToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  pendleStaking({ address, network }: ContractOpts) {
    return PendleStaking__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  pendleStakingManager({ address, network }: ContractOpts) {
    return PendleStakingManager__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  pendleYieldToken({ address, network }: ContractOpts) {
    return PendleYieldToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
