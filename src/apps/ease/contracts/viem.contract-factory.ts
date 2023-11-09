import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  EaseRcaShield__factory,
  EaseRcaShieldAave__factory,
  EaseRcaShieldCompound__factory,
  EaseRcaShieldConvex__factory,
  EaseRcaShieldOnsen__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class EaseViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  easeRcaShield({ address, network }: ContractOpts) {
    return EaseRcaShield__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  easeRcaShieldAave({ address, network }: ContractOpts) {
    return EaseRcaShieldAave__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  easeRcaShieldCompound({ address, network }: ContractOpts) {
    return EaseRcaShieldCompound__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  easeRcaShieldConvex({ address, network }: ContractOpts) {
    return EaseRcaShieldConvex__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  easeRcaShieldOnsen({ address, network }: ContractOpts) {
    return EaseRcaShieldOnsen__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
