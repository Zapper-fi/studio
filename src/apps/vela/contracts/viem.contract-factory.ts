import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { VelaComplexRewarder__factory, VelaTokenFarm__factory, VelaVault__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class VelaViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  velaComplexRewarder({ address, network }: ContractOpts) {
    return VelaComplexRewarder__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  velaTokenFarm({ address, network }: ContractOpts) {
    return VelaTokenFarm__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  velaVault({ address, network }: ContractOpts) {
    return VelaVault__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
