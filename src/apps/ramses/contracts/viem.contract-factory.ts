import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  RamsesBribe__factory,
  RamsesGauge__factory,
  RamsesPool__factory,
  RamsesRewards__factory,
  RamsesVe__factory,
  RamsesVoter__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class RamsesViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  ramsesBribe({ address, network }: ContractOpts) {
    return RamsesBribe__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  ramsesGauge({ address, network }: ContractOpts) {
    return RamsesGauge__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  ramsesPool({ address, network }: ContractOpts) {
    return RamsesPool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  ramsesRewards({ address, network }: ContractOpts) {
    return RamsesRewards__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  ramsesVe({ address, network }: ContractOpts) {
    return RamsesVe__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  ramsesVoter({ address, network }: ContractOpts) {
    return RamsesVoter__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
