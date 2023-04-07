import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import {
  BasketHandler__factory,
  FacadeRead__factory,
  Main__factory,
  Rtoken__factory,
  StakedRsr__factory,
} from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class ReserveProtocolContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  basketHandler({ address, network }: ContractOpts) {
    return BasketHandler__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  facadeRead({ address, network }: ContractOpts) {
    return FacadeRead__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  main({ address, network }: ContractOpts) {
    return Main__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  rtoken({ address, network }: ContractOpts) {
    return Rtoken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  stakedRsr({ address, network }: ContractOpts) {
    return StakedRsr__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { BasketHandler } from './ethers';
export type { FacadeRead } from './ethers';
export type { Main } from './ethers';
export type { Rtoken } from './ethers';
export type { StakedRsr } from './ethers';
