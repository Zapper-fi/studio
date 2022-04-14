import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { EnzymeFinanceVault__factory } from './ethers';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class EnzymeFinanceContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  enzymeFinanceVault({ address, network }: ContractOpts) {
    return EnzymeFinanceVault__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { EnzymeFinanceVault } from './ethers';
