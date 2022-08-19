import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { TrisolarisFactory__factory } from './ethers';
import { TrisolarisMasterChef__factory } from './ethers';
import { TrisolarisPair__factory } from './ethers';
import { TrisolarisRewarder__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class TrisolarisContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  trisolarisFactory({ address, network }: ContractOpts) {
    return TrisolarisFactory__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  trisolarisMasterChef({ address, network }: ContractOpts) {
    return TrisolarisMasterChef__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  trisolarisPair({ address, network }: ContractOpts) {
    return TrisolarisPair__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  trisolarisRewarder({ address, network }: ContractOpts) {
    return TrisolarisRewarder__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { TrisolarisFactory } from './ethers';
export type { TrisolarisMasterChef } from './ethers';
export type { TrisolarisPair } from './ethers';
export type { TrisolarisRewarder } from './ethers';
