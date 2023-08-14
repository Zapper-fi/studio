import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
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
} from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class InverseFirmContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  borrowController({ address, network }: ContractOpts) {
    return BorrowController__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  dbr({ address, network }: ContractOpts) {
    return Dbr__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  dbrDistributor({ address, network }: ContractOpts) {
    return DbrDistributor__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  rewardableEscrow({ address, network }: ContractOpts) {
    return RewardableEscrow__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  simpleEscrow({ address, network }: ContractOpts) {
    return SimpleEscrow__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  simpleMarket({ address, network }: ContractOpts) {
    return SimpleMarket__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  stCvxCrv({ address, network }: ContractOpts) {
    return StCvxCrv__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  stCvxFxs({ address, network }: ContractOpts) {
    return StCvxFxs__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  xinv({ address, network }: ContractOpts) {
    return Xinv__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { BorrowController } from './ethers';
export type { Dbr } from './ethers';
export type { DbrDistributor } from './ethers';
export type { RewardableEscrow } from './ethers';
export type { SimpleEscrow } from './ethers';
export type { SimpleMarket } from './ethers';
export type { StCvxCrv } from './ethers';
export type { StCvxFxs } from './ethers';
export type { Xinv } from './ethers';
