import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  PenguinChef__factory,
  PenguinChefV2__factory,
  PenguinExtraRewarder__factory,
  PenguinIPefi__factory,
  PenguinRewarderRate__factory,
  PenguinVault__factory,
  PenguinXPefi__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class PenguinViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  penguinChef({ address, network }: ContractOpts) {
    return PenguinChef__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  penguinChefV2({ address, network }: ContractOpts) {
    return PenguinChefV2__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  penguinExtraRewarder({ address, network }: ContractOpts) {
    return PenguinExtraRewarder__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  penguinIPefi({ address, network }: ContractOpts) {
    return PenguinIPefi__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  penguinRewarderRate({ address, network }: ContractOpts) {
    return PenguinRewarderRate__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  penguinVault({ address, network }: ContractOpts) {
    return PenguinVault__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  penguinXPefi({ address, network }: ContractOpts) {
    return PenguinXPefi__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
