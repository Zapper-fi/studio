import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  BadgerDiggToken__factory,
  BadgerRegistry__factory,
  BadgerSett__factory,
  BadgerTree__factory,
  BadgerYearnVault__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class BadgerViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  badgerDiggToken({ address, network }: ContractOpts) {
    return BadgerDiggToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  badgerRegistry({ address, network }: ContractOpts) {
    return BadgerRegistry__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  badgerSett({ address, network }: ContractOpts) {
    return BadgerSett__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  badgerTree({ address, network }: ContractOpts) {
    return BadgerTree__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  badgerYearnVault({ address, network }: ContractOpts) {
    return BadgerYearnVault__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
