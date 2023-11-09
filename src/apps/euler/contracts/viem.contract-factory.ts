import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  EulerDtokenContract__factory,
  EulerEtokenContract__factory,
  EulerPtokenContract__factory,
  EulerStakingRewardsContract__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class EulerViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  eulerDtokenContract({ address, network }: ContractOpts) {
    return EulerDtokenContract__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  eulerEtokenContract({ address, network }: ContractOpts) {
    return EulerEtokenContract__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  eulerPtokenContract({ address, network }: ContractOpts) {
    return EulerPtokenContract__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  eulerStakingRewardsContract({ address, network }: ContractOpts) {
    return EulerStakingRewardsContract__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
