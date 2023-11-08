import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  BorrowController__factory,
  Dbr__factory,
  DbrDistributor__factory,
  RewardableEscrow__factory,
  SimpleEscrow__factory,
  SimpleMarket__factory,
  StCvxCrv__factory,
  StCvxFxs__factory,
  Xinv__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class InverseFirmViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  borrowController({ address, network }: ContractOpts) {
    return BorrowController__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  dbr({ address, network }: ContractOpts) {
    return Dbr__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  dbrDistributor({ address, network }: ContractOpts) {
    return DbrDistributor__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  rewardableEscrow({ address, network }: ContractOpts) {
    return RewardableEscrow__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  simpleEscrow({ address, network }: ContractOpts) {
    return SimpleEscrow__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  simpleMarket({ address, network }: ContractOpts) {
    return SimpleMarket__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  stCvxCrv({ address, network }: ContractOpts) {
    return StCvxCrv__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  stCvxFxs({ address, network }: ContractOpts) {
    return StCvxFxs__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  xinv({ address, network }: ContractOpts) {
    return Xinv__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
