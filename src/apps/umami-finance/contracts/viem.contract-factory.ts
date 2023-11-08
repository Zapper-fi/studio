import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  UmamiFinanceCompound__factory,
  UmamiFinanceGlpVault__factory,
  UmamiFinanceMarinate__factory,
  UmamiFinanceTimelockedGlpVault__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class UmamiFinanceViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  umamiFinanceCompound({ address, network }: ContractOpts) {
    return UmamiFinanceCompound__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  umamiFinanceGlpVault({ address, network }: ContractOpts) {
    return UmamiFinanceGlpVault__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  umamiFinanceMarinate({ address, network }: ContractOpts) {
    return UmamiFinanceMarinate__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  umamiFinanceTimelockedGlpVault({ address, network }: ContractOpts) {
    return UmamiFinanceTimelockedGlpVault__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
