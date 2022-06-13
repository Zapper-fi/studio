import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { VvsBar__factory } from './ethers';
import { VvsBoost__factory } from './ethers';
import { VvsCraftsman__factory } from './ethers';
import { VvsCraftsmanV2__factory } from './ethers';
import { VvsFactory__factory } from './ethers';
import { VvsPair__factory } from './ethers';
import { VvsRewarder__factory } from './ethers';
import { VvsSmartCraftInitializable__factory } from './ethers';
import { VvsVault__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class VvsFinanceContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  vvsBar({ address, network }: ContractOpts) {
    return VvsBar__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  vvsBoost({ address, network }: ContractOpts) {
    return VvsBoost__factory.connect(address, this.appToolkit.getNetworkProvider(network));
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
  vvsSmartCraftInitializable({ address, network }: ContractOpts) {
    return VvsSmartCraftInitializable__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  vvsVault({ address, network }: ContractOpts) {
    return VvsVault__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { VvsBar } from './ethers';
export type { VvsBoost } from './ethers';
export type { VvsCraftsman } from './ethers';
export type { VvsCraftsmanV2 } from './ethers';
export type { VvsFactory } from './ethers';
export type { VvsPair } from './ethers';
export type { VvsRewarder } from './ethers';
export type { VvsSmartCraftInitializable } from './ethers';
export type { VvsVault } from './ethers';
