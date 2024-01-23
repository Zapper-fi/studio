import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { RevertFinanceCompoundor__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class RevertFinanceViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  revertFinanceCompoundor({ address, network }: ContractOpts) {
    return RevertFinanceCompoundor__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
