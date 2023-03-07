import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { VelaComplexRewarder__factory, VelaTokenFarm__factory, VelaVault__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class VelaContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  velaComplexRewarder({ address, network }: ContractOpts) {
    return VelaComplexRewarder__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  velaTokenFarm({ address, network }: ContractOpts) {
    return VelaTokenFarm__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  velaVault({ address, network }: ContractOpts) {
    return VelaVault__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { VelaComplexRewarder } from './ethers';
export type { VelaTokenFarm } from './ethers';
export type { VelaVault } from './ethers';
