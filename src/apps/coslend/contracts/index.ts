import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { CoslendCToken__factory } from './ethers';
import { CoslendComptroller__factory } from './ethers';
import { CoslendLens__factory } from './ethers';
import { CoslendOracle__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class CoslendContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  coslendCToken({ address, network }: ContractOpts) {
    return CoslendCToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  coslendComptroller({ address, network }: ContractOpts) {
    return CoslendComptroller__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  coslendLens({ address, network }: ContractOpts) {
    return CoslendLens__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  coslendOracle({ address, network }: ContractOpts) {
    return CoslendOracle__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { CoslendCToken } from './ethers';
export type { CoslendComptroller } from './ethers';
export type { CoslendLens } from './ethers';
export type { CoslendOracle } from './ethers';
