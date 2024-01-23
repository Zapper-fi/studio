import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  BorrowPositionProxy__factory,
  DepositWithdrawalProxy__factory,
  DolomiteAmmFactory__factory,
  DolomiteAmmPair__factory,
  DolomiteMargin__factory,
  IsolationModeToken__factory,
  Token__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class DolomiteViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  borrowPositionProxy({ address, network }: ContractOpts) {
    return BorrowPositionProxy__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  depositWithdrawalProxy({ address, network }: ContractOpts) {
    return DepositWithdrawalProxy__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  dolomiteAmmFactory({ address, network }: ContractOpts) {
    return DolomiteAmmFactory__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  dolomiteAmmPair({ address, network }: ContractOpts) {
    return DolomiteAmmPair__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  dolomiteMargin({ address, network }: ContractOpts) {
    return DolomiteMargin__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  isolationModeToken({ address, network }: ContractOpts) {
    return IsolationModeToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  token({ address, network }: ContractOpts) {
    return Token__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
