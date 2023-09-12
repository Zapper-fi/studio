import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import {
  PikaProtocolEsPika__factory,
  PikaProtocolVault__factory,
  PikaProtocolVaultReward__factory,
  PikaProtocolVester__factory,
} from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class PikaProtocolContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  pikaProtocolEsPika({ address, network }: ContractOpts) {
    return PikaProtocolEsPika__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pikaProtocolVault({ address, network }: ContractOpts) {
    return PikaProtocolVault__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pikaProtocolVaultReward({ address, network }: ContractOpts) {
    return PikaProtocolVaultReward__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pikaProtocolVester({ address, network }: ContractOpts) {
    return PikaProtocolVester__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { PikaProtocolEsPika } from './ethers';
export type { PikaProtocolVault } from './ethers';
export type { PikaProtocolVaultReward } from './ethers';
export type { PikaProtocolVester } from './ethers';
