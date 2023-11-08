import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  NereusFinanceLendingPoolProvider__factory,
  NereusFinanceProtocolDataProvider__factory,
  NereusFinanceStakedTokenIncentivesController__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class NereusFinanceViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  nereusFinanceLendingPoolProvider({ address, network }: ContractOpts) {
    return NereusFinanceLendingPoolProvider__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  nereusFinanceProtocolDataProvider({ address, network }: ContractOpts) {
    return NereusFinanceProtocolDataProvider__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  nereusFinanceStakedTokenIncentivesController({ address, network }: ContractOpts) {
    return NereusFinanceStakedTokenIncentivesController__factory.connect(
      address,
      this.appToolkit.getViemNetworkProvider(network),
    );
  }
}
