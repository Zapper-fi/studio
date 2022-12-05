import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { BendDaoBToken__factory } from './ethers';
import { BendDaoDebtToken__factory } from './ethers';
import { BendDaoLendPool__factory } from './ethers';
import { BendDaoLendPoolAddressesProvider__factory } from './ethers';
import { BendDaoProtocolDataProvider__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class BendDaoContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  bendDaoBToken({ address, network }: ContractOpts) {
    return BendDaoBToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  bendDaoDebtToken({ address, network }: ContractOpts) {
    return BendDaoDebtToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  bendDaoLendPool({ address, network }: ContractOpts) {
    return BendDaoLendPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  bendDaoLendPoolAddressesProvider({ address, network }: ContractOpts) {
    return BendDaoLendPoolAddressesProvider__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  bendDaoProtocolDataProvider({ address, network }: ContractOpts) {
    return BendDaoProtocolDataProvider__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { BendDaoBToken } from './ethers';
export type { BendDaoDebtToken } from './ethers';
export type { BendDaoLendPool } from './ethers';
export type { BendDaoLendPoolAddressesProvider } from './ethers';
export type { BendDaoProtocolDataProvider } from './ethers';
