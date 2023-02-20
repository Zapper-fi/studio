import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { CozyFinanceCToken__factory } from './ethers';
import { CozyFinanceComptroller__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class CozyFinanceContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  cozyFinanceCToken({ address, network }: ContractOpts) {
    return CozyFinanceCToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  cozyFinanceComptroller({ address, network }: ContractOpts) {
    return CozyFinanceComptroller__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { CozyFinanceCToken } from './ethers';
export type { CozyFinanceComptroller } from './ethers';
