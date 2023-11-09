import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  CleverFeeDistributor__factory,
  CleverFurnace__factory,
  CleverGauge__factory,
  CleverGaugeController__factory,
  CleverLocker__factory,
  CleverVesting__factory,
  CleverVotingEscrow__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class CleverViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  cleverFeeDistributor({ address, network }: ContractOpts) {
    return CleverFeeDistributor__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  cleverFurnace({ address, network }: ContractOpts) {
    return CleverFurnace__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  cleverGauge({ address, network }: ContractOpts) {
    return CleverGauge__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  cleverGaugeController({ address, network }: ContractOpts) {
    return CleverGaugeController__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  cleverLocker({ address, network }: ContractOpts) {
    return CleverLocker__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  cleverVesting({ address, network }: ContractOpts) {
    return CleverVesting__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  cleverVotingEscrow({ address, network }: ContractOpts) {
    return CleverVotingEscrow__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
