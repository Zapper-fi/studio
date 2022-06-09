import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { VvsCraftsman__factory } from './ethers';
import { VvsCraftsmanV2__factory } from './ethers';
import { VvsFactory__factory } from './ethers';
import { VvsPair__factory } from './ethers';
import { VvsRewarder__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class VvsFinanceContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  vvsCraftsman({ address, network }: ContractOpts) {
    return VvsCraftsman__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  vvsCraftsmanV2({ address, network }: ContractOpts) {
    return VvsCraftsmanV2__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  vvsFactory({ address, network }: ContractOpts) {
    return VvsFactory__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  vvsPair({ address, network }: ContractOpts) {
    return VvsPair__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  vvsRewarder({ address, network }: ContractOpts) {
    return VvsRewarder__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { VvsCraftsman } from './ethers';
export type { VvsCraftsmanV2 } from './ethers';
export type { VvsFactory } from './ethers';
export type { VvsPair } from './ethers';
export type { VvsRewarder } from './ethers';
