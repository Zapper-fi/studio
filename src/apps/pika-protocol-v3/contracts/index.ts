import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { PikaProtocolV3Rewards__factory } from './ethers';
import { PikaProtocolV3Vault__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class PikaProtocolV3ContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  pikaProtocolV3Rewards({ address, network }: ContractOpts) {
    return PikaProtocolV3Rewards__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pikaProtocolV3Vault({ address, network }: ContractOpts) {
    return PikaProtocolV3Vault__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { PikaProtocolV3Rewards } from './ethers';
export type { PikaProtocolV3Vault } from './ethers';
