import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { CozyFinanceCToken__factory, CozyFinanceComptroller__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class CozyFinanceViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  cozyFinanceCToken({ address, network }: ContractOpts) {
    return CozyFinanceCToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  cozyFinanceComptroller({ address, network }: ContractOpts) {
    return CozyFinanceComptroller__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
