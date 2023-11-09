import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { RevertFinanceCompoundor__factory } from './ethers';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class RevertFinanceContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  revertFinanceCompoundor({ address, network }: ContractOpts) {
    return RevertFinanceCompoundor__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { RevertFinanceCompoundor } from './ethers';
