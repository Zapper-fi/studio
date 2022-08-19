import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { MmFinanceChef__factory } from './ethers';
import { MmFinanceChefV2__factory } from './ethers';
import { MmFinanceIfoChef__factory } from './ethers';
import { MmFinanceMeerkatChef__factory } from './ethers';
import { MmFinancePair__factory } from './ethers';
import { MmFinanceSmartChef__factory } from './ethers';
import { MmFinanceSyrupMeerkat__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class MmFinanceContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  mmFinanceChef({ address, network }: ContractOpts) {
    return MmFinanceChef__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  mmFinanceChefV2({ address, network }: ContractOpts) {
    return MmFinanceChefV2__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  mmFinanceIfoChef({ address, network }: ContractOpts) {
    return MmFinanceIfoChef__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  mmFinanceMeerkatChef({ address, network }: ContractOpts) {
    return MmFinanceMeerkatChef__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  mmFinancePair({ address, network }: ContractOpts) {
    return MmFinancePair__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  mmFinanceSmartChef({ address, network }: ContractOpts) {
    return MmFinanceSmartChef__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  mmFinanceSyrupMeerkat({ address, network }: ContractOpts) {
    return MmFinanceSyrupMeerkat__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { MmFinanceChef } from './ethers';
export type { MmFinanceChefV2 } from './ethers';
export type { MmFinanceIfoChef } from './ethers';
export type { MmFinanceMeerkatChef } from './ethers';
export type { MmFinancePair } from './ethers';
export type { MmFinanceSmartChef } from './ethers';
export type { MmFinanceSyrupMeerkat } from './ethers';
