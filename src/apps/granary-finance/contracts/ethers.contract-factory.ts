import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { GranaryFinanceLendingPoolProvider__factory, GranaryFinanceProtocolDataProvider__factory } from './ethers';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class GranaryFinanceContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  granaryFinanceLendingPoolProvider({ address, network }: ContractOpts) {
    return GranaryFinanceLendingPoolProvider__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  granaryFinanceProtocolDataProvider({ address, network }: ContractOpts) {
    return GranaryFinanceProtocolDataProvider__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { GranaryFinanceLendingPoolProvider } from './ethers';
export type { GranaryFinanceProtocolDataProvider } from './ethers';
