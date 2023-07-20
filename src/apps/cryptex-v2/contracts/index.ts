import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import {
  DsuToken__factory,
  LongPosition__factory,
  Rebates__factory,
  ShortPosition__factory,
  TvaToken__factory,
} from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class CryptexV2ContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  dsuToken({ address, network }: ContractOpts) {
    return DsuToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  longPosition({ address, network }: ContractOpts) {
    return LongPosition__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  rebates({ address, network }: ContractOpts) {
    return Rebates__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  shortPosition({ address, network }: ContractOpts) {
    return ShortPosition__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  tvaToken({ address, network }: ContractOpts) {
    return TvaToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { DsuToken } from './ethers';
export type { LongPosition } from './ethers';
export type { Rebates } from './ethers';
export type { ShortPosition } from './ethers';
export type { TvaToken } from './ethers';
