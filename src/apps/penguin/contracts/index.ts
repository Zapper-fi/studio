import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { PenguinChef__factory } from './ethers';
import { PenguinChefV2__factory } from './ethers';
import { PenguinExtraRewarder__factory } from './ethers';
import { PenguinIPefi__factory } from './ethers';
import { PenguinVault__factory } from './ethers';
import { PenguinXPefi__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class PenguinContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  penguinChef({ address, network }: ContractOpts) {
    return PenguinChef__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  penguinChefV2({ address, network }: ContractOpts) {
    return PenguinChefV2__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  penguinExtraRewarder({ address, network }: ContractOpts) {
    return PenguinExtraRewarder__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  penguinIPefi({ address, network }: ContractOpts) {
    return PenguinIPefi__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  penguinVault({ address, network }: ContractOpts) {
    return PenguinVault__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  penguinXPefi({ address, network }: ContractOpts) {
    return PenguinXPefi__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { PenguinChef } from './ethers';
export type { PenguinChefV2 } from './ethers';
export type { PenguinExtraRewarder } from './ethers';
export type { PenguinIPefi } from './ethers';
export type { PenguinVault } from './ethers';
export type { PenguinXPefi } from './ethers';
