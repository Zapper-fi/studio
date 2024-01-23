import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  VelodromeV2Bribe__factory,
  VelodromeV2Gauge__factory,
  VelodromeV2Pool__factory,
  VelodromeV2PoolFactory__factory,
  VelodromeV2Rewards__factory,
  VelodromeV2Ve__factory,
  VelodromeV2Voter__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class VelodromeV2ViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  velodromeV2Bribe({ address, network }: ContractOpts) {
    return VelodromeV2Bribe__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  velodromeV2Gauge({ address, network }: ContractOpts) {
    return VelodromeV2Gauge__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  velodromeV2Pool({ address, network }: ContractOpts) {
    return VelodromeV2Pool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  velodromeV2PoolFactory({ address, network }: ContractOpts) {
    return VelodromeV2PoolFactory__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  velodromeV2Rewards({ address, network }: ContractOpts) {
    return VelodromeV2Rewards__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  velodromeV2Ve({ address, network }: ContractOpts) {
    return VelodromeV2Ve__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  velodromeV2Voter({ address, network }: ContractOpts) {
    return VelodromeV2Voter__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
