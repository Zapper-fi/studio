import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  UwuLendDataProvider__factory,
  UwuLendStakingV1__factory,
  UwuLendStakingV2__factory,
  UwuLendUToken__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class UwuLendViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  uwuLendDataProvider({ address, network }: ContractOpts) {
    return UwuLendDataProvider__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  uwuLendStakingV1({ address, network }: ContractOpts) {
    return UwuLendStakingV1__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  uwuLendStakingV2({ address, network }: ContractOpts) {
    return UwuLendStakingV2__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  uwuLendUToken({ address, network }: ContractOpts) {
    return UwuLendUToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
