import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  AccountFactory__factory,
  AirdropDistributor__factory,
  ContractsRegister__factory,
  CreditManagerV2__factory,
  DieselToken__factory,
  GearboxLendingTokenV3__factory,
  PoolService__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class GearboxViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  accountFactory({ address, network }: ContractOpts) {
    return AccountFactory__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  airdropDistributor({ address, network }: ContractOpts) {
    return AirdropDistributor__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  contractsRegister({ address, network }: ContractOpts) {
    return ContractsRegister__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  creditManagerV2({ address, network }: ContractOpts) {
    return CreditManagerV2__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  dieselToken({ address, network }: ContractOpts) {
    return DieselToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  gearboxLendingTokenV3({ address, network }: ContractOpts) {
    return GearboxLendingTokenV3__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  poolService({ address, network }: ContractOpts) {
    return PoolService__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
