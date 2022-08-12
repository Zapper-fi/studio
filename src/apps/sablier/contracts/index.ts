import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { SablierSalary__factory } from './ethers';
import { SablierStream__factory } from './ethers';
import { SablierStreamLegacy__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class SablierContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  sablierSalary({ address, network }: ContractOpts) {
    return SablierSalary__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  sablierStream({ address, network }: ContractOpts) {
    return SablierStream__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  sablierStreamLegacy({ address, network }: ContractOpts) {
    return SablierStreamLegacy__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { SablierSalary } from './ethers';
export type { SablierStream } from './ethers';
export type { SablierStreamLegacy } from './ethers';
