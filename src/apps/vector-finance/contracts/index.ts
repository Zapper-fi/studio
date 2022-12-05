import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { VectorFinanceMasterChef__factory } from './ethers';
import { VectorFinanceMasterChefPoolHelper__factory } from './ethers';
import { VectorFinanceMasterChefRewarder__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class VectorFinanceContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  vectorFinanceMasterChef({ address, network }: ContractOpts) {
    return VectorFinanceMasterChef__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  vectorFinanceMasterChefPoolHelper({ address, network }: ContractOpts) {
    return VectorFinanceMasterChefPoolHelper__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  vectorFinanceMasterChefRewarder({ address, network }: ContractOpts) {
    return VectorFinanceMasterChefRewarder__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { VectorFinanceMasterChef } from './ethers';
export type { VectorFinanceMasterChefPoolHelper } from './ethers';
export type { VectorFinanceMasterChefRewarder } from './ethers';
