import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import {
  BorrowPositionProxy__factory,
  DepositWithdrawalProxy__factory,
  DolomiteMargin__factory,
  DolomiteMarginIsolationModeToken__factory,
  Token__factory,
} from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class DolomiteContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  borrowPositionProxy({ address, network }: ContractOpts) {
    return BorrowPositionProxy__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  depositWithdrawalProxy({ address, network }: ContractOpts) {
    return DepositWithdrawalProxy__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  dolomiteMargin({ address, network }: ContractOpts) {
    return DolomiteMargin__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  dolomiteMarginIsolationModeToken({ address, network }: ContractOpts) {
    return DolomiteMarginIsolationModeToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  token({ address, network }: ContractOpts) {
    return Token__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { BorrowPositionProxy } from './ethers';
export type { DepositWithdrawalProxy } from './ethers';
export type { DolomiteMargin } from './ethers';
export type { DolomiteMarginIsolationModeToken } from './ethers';
export type { Token } from './ethers';
