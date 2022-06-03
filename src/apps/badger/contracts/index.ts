import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { BadgerDiggToken__factory } from './ethers';
import { BadgerRegistry__factory } from './ethers';
import { BadgerSett__factory } from './ethers';
import { BadgerTree__factory } from './ethers';
import { BadgerYearnVault__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class BadgerContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  badgerDiggToken({ address, network }: ContractOpts) {
    return BadgerDiggToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  badgerRegistry({ address, network }: ContractOpts) {
    return BadgerRegistry__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  badgerSett({ address, network }: ContractOpts) {
    return BadgerSett__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  badgerTree({ address, network }: ContractOpts) {
    return BadgerTree__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  badgerYearnVault({ address, network }: ContractOpts) {
    return BadgerYearnVault__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { BadgerDiggToken } from './ethers';
export type { BadgerRegistry } from './ethers';
export type { BadgerSett } from './ethers';
export type { BadgerTree } from './ethers';
export type { BadgerYearnVault } from './ethers';
