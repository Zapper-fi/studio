import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import {
  CamelotDividend__factory,
  CamelotFactory__factory,
  CamelotMaster__factory,
  CamelotNftPool__factory,
  CamelotPair__factory,
  CamelotXGrail__factory,
} from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class CamelotContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  camelotDividend({ address, network }: ContractOpts) {
    return CamelotDividend__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  camelotFactory({ address, network }: ContractOpts) {
    return CamelotFactory__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  camelotMaster({ address, network }: ContractOpts) {
    return CamelotMaster__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  camelotNftPool({ address, network }: ContractOpts) {
    return CamelotNftPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  camelotPair({ address, network }: ContractOpts) {
    return CamelotPair__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  camelotXGrail({ address, network }: ContractOpts) {
    return CamelotXGrail__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { CamelotDividend } from './ethers';
export type { CamelotFactory } from './ethers';
export type { CamelotMaster } from './ethers';
export type { CamelotNftPool } from './ethers';
export type { CamelotPair } from './ethers';
export type { CamelotXGrail } from './ethers';
