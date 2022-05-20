import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { EaseRcaShield__factory } from './ethers';
import { EaseRcaShieldAave__factory } from './ethers';
import { EaseRcaShieldCompound__factory } from './ethers';
import { EaseRcaShieldConvex__factory } from './ethers';
import { EaseRcaShieldOnsen__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class EaseContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  easeRcaShield({ address, network }: ContractOpts) {
    return EaseRcaShield__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  easeRcaShieldAave({ address, network }: ContractOpts) {
    return EaseRcaShieldAave__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  easeRcaShieldCompound({ address, network }: ContractOpts) {
    return EaseRcaShieldCompound__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  easeRcaShieldConvex({ address, network }: ContractOpts) {
    return EaseRcaShieldConvex__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  easeRcaShieldOnsen({ address, network }: ContractOpts) {
    return EaseRcaShieldOnsen__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { EaseRcaShield } from './ethers';
export type { EaseRcaShieldAave } from './ethers';
export type { EaseRcaShieldCompound } from './ethers';
export type { EaseRcaShieldConvex } from './ethers';
export type { EaseRcaShieldOnsen } from './ethers';
