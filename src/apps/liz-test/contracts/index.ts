import { Injectable, Inject } from '@nestjs/common';
import { StaticJsonRpcProvider } from '@ethersproject/providers';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';

import { NetworkProviderService } from '~network-provider/network-provider.service';
import { Network } from '~types/network.interface';

import { PickleGauge__factory } from './ethers';
import type { PickleGauge } from './ethers';
import { PickleJar__factory } from './ethers';
import type { PickleJar } from './ethers';
import { ContractFactory } from '~contract/contracts';
// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class LizTestContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  pickleGauge({ address, network }: ContractOpts) {
    return PickleGauge__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pickleJar({ address, network }: ContractOpts) {
    return PickleJar__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { PickleGauge } from './ethers';
export type { PickleJar } from './ethers';
