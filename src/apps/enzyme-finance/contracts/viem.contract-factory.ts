import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { EnzymeFinanceVault__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class EnzymeFinanceViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  enzymeFinanceVault({ address, network }: ContractOpts) {
    return EnzymeFinanceVault__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
