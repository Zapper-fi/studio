import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { ContractsRegister__factory } from './ethers';
import { CreditManagerV2__factory } from './ethers';
import { DieselToken__factory } from './ethers';
import { PhantomToken__factory } from './ethers';
import { PoolService__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class GearboxContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
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

export type { ContractsRegister } from './ethers';
export type { CreditManagerV2 } from './ethers';
export type { DieselToken } from './ethers';
export type { PhantomToken } from './ethers';
export type { PoolService } from './ethers';
