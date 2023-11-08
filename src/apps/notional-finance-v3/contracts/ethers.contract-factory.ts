import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { NotionalFCash__factory, NotionalPCash__factory, NotionalView__factory } from './ethers';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class NotionalFinanceV3ContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  notionalFCash({ address, network }: ContractOpts) {
    return NotionalFCash__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  notionalPCash({ address, network }: ContractOpts) {
    return NotionalPCash__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  notionalView({ address, network }: ContractOpts) {
    return NotionalView__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { NotionalFCash } from './ethers';
export type { NotionalPCash } from './ethers';
export type { NotionalView } from './ethers';
