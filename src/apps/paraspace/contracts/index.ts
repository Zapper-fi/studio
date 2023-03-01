import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import {
  ParaspaceAutoCompoundApe__factory,
  ParaspaceDToken__factory,
  ParaspaceLending__factory,
  ParaspacePToken__factory,
} from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class ParaspaceContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  paraspaceAutoCompoundApe({ address, network }: ContractOpts) {
    return ParaspaceAutoCompoundApe__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  paraspaceDToken({ address, network }: ContractOpts) {
    return ParaspaceDToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  paraspaceLending({ address, network }: ContractOpts) {
    return ParaspaceLending__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  paraspacePToken({ address, network }: ContractOpts) {
    return ParaspacePToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { ParaspaceAutoCompoundApe } from './ethers';
export type { ParaspaceDToken } from './ethers';
export type { ParaspaceLending } from './ethers';
export type { ParaspacePToken } from './ethers';
