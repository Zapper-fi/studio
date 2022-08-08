import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { OpenleverageFactory__factory } from './ethers';
import { OpenleverageLpool__factory } from './ethers';
// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class OpenleverageContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  openleverageFactory({ address, network }: ContractOpts) {
    return OpenleverageFactory__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  openleverageLpool({ address, network }: ContractOpts) {
    return OpenleverageLpool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { OpenleverageFactory } from './ethers';
export type { OpenleverageLpool } from './ethers';
