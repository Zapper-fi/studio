import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { GranaryFinanceLendingPoolProvider__factory, GranaryFinanceProtocolDataProvider__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class GranaryFinanceViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  granaryFinanceLendingPoolProvider({ address, network }: ContractOpts) {
    return GranaryFinanceLendingPoolProvider__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  granaryFinanceProtocolDataProvider({ address, network }: ContractOpts) {
    return GranaryFinanceProtocolDataProvider__factory.connect(
      address,
      this.appToolkit.getViemNetworkProvider(network),
    );
  }
}
