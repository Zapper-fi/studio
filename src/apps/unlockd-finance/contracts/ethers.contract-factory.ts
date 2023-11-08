import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import {
  UnlockdFinanceDebtToken__factory,
  UnlockdFinanceLendPool__factory,
  UnlockdFinanceLendPoolAddressesProvider__factory,
  UnlockdFinanceProtocolDataProvider__factory,
  UnlockdFinanceUToken__factory,
} from './ethers';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class UnlockdFinanceContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  unlockdFinanceDebtToken({ address, network }: ContractOpts) {
    return UnlockdFinanceDebtToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  unlockdFinanceLendPool({ address, network }: ContractOpts) {
    return UnlockdFinanceLendPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  unlockdFinanceLendPoolAddressesProvider({ address, network }: ContractOpts) {
    return UnlockdFinanceLendPoolAddressesProvider__factory.connect(
      address,
      this.appToolkit.getNetworkProvider(network),
    );
  }
  unlockdFinanceProtocolDataProvider({ address, network }: ContractOpts) {
    return UnlockdFinanceProtocolDataProvider__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  unlockdFinanceUToken({ address, network }: ContractOpts) {
    return UnlockdFinanceUToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { UnlockdFinanceDebtToken } from './ethers';
export type { UnlockdFinanceLendPool } from './ethers';
export type { UnlockdFinanceLendPoolAddressesProvider } from './ethers';
export type { UnlockdFinanceProtocolDataProvider } from './ethers';
export type { UnlockdFinanceUToken } from './ethers';
