import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  MeanFinanceHub__factory,
  MeanFinanceOptimismAirdrop__factory,
  MeanFinancePermissionManager__factory,
  MeanFinanceTransformerRegistry__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class MeanFinanceViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  meanFinanceHub({ address, network }: ContractOpts) {
    return MeanFinanceHub__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  meanFinanceOptimismAirdrop({ address, network }: ContractOpts) {
    return MeanFinanceOptimismAirdrop__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  meanFinancePermissionManager({ address, network }: ContractOpts) {
    return MeanFinancePermissionManager__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  meanFinanceTransformerRegistry({ address, network }: ContractOpts) {
    return MeanFinanceTransformerRegistry__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
