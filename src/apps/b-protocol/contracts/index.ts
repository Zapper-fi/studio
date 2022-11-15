import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { BProtocolBammLens__factory } from './ethers';
import { BProtocolCompoundRegistry__factory } from './ethers';
import { BProtocolGetInfo__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class BProtocolContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  bProtocolBammLens({ address, network }: ContractOpts) {
    return BProtocolBammLens__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  bProtocolCompoundRegistry({ address, network }: ContractOpts) {
    return BProtocolCompoundRegistry__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  bProtocolGetInfo({ address, network }: ContractOpts) {
    return BProtocolGetInfo__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { BProtocolBammLens } from './ethers';
export type { BProtocolCompoundRegistry } from './ethers';
export type { BProtocolGetInfo } from './ethers';
