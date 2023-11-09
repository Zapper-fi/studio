import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  VectorFinanceMasterChef__factory,
  VectorFinanceMasterChefPoolHelper__factory,
  VectorFinanceMasterChefRewarder__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class VectorFinanceViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  vectorFinanceMasterChef({ address, network }: ContractOpts) {
    return VectorFinanceMasterChef__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  vectorFinanceMasterChefPoolHelper({ address, network }: ContractOpts) {
    return VectorFinanceMasterChefPoolHelper__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  vectorFinanceMasterChefRewarder({ address, network }: ContractOpts) {
    return VectorFinanceMasterChefRewarder__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
