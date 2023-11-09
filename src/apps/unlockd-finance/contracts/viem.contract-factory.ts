import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  UnlockdFinanceDebtToken__factory,
  UnlockdFinanceLendPool__factory,
  UnlockdFinanceLendPoolAddressesProvider__factory,
  UnlockdFinanceProtocolDataProvider__factory,
  UnlockdFinanceUToken__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class UnlockdFinanceViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  unlockdFinanceDebtToken({ address, network }: ContractOpts) {
    return UnlockdFinanceDebtToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  unlockdFinanceLendPool({ address, network }: ContractOpts) {
    return UnlockdFinanceLendPool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  unlockdFinanceLendPoolAddressesProvider({ address, network }: ContractOpts) {
    return UnlockdFinanceLendPoolAddressesProvider__factory.connect(
      address,
      this.appToolkit.getViemNetworkProvider(network),
    );
  }
  unlockdFinanceProtocolDataProvider({ address, network }: ContractOpts) {
    return UnlockdFinanceProtocolDataProvider__factory.connect(
      address,
      this.appToolkit.getViemNetworkProvider(network),
    );
  }
  unlockdFinanceUToken({ address, network }: ContractOpts) {
    return UnlockdFinanceUToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
