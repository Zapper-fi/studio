import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import {
  AccountFactory__factory,
  AirdropDistributor__factory,
  ContractsRegister__factory,
  CreditManagerV2__factory,
  DieselToken__factory,
  PhantomToken__factory,
  PoolService__factory,
} from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class GearboxContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  accountFactory({ address, network }: ContractOpts) {
    return AccountFactory__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  airdropDistributor({ address, network }: ContractOpts) {
    return AirdropDistributor__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  contractsRegister({ address, network }: ContractOpts) {
    return ContractsRegister__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  creditManagerV2({ address, network }: ContractOpts) {
    return CreditManagerV2__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  dieselToken({ address, network }: ContractOpts) {
    return DieselToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  phantomToken({ address, network }: ContractOpts) {
    return PhantomToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  poolService({ address, network }: ContractOpts) {
    return PoolService__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { AccountFactory } from './ethers';
export type { AirdropDistributor } from './ethers';
export type { ContractsRegister } from './ethers';
export type { CreditManagerV2 } from './ethers';
export type { DieselToken } from './ethers';
export type { PhantomToken } from './ethers';
export type { PoolService } from './ethers';
