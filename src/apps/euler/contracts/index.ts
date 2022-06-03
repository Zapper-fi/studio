import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { EulerDtokenContract__factory } from './ethers';
import { EulerEtokenContract__factory } from './ethers';
import { EulerPtokenContract__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class EulerContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  eulerDtokenContract({ address, network }: ContractOpts) {
    return EulerDtokenContract__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  eulerEtokenContract({ address, network }: ContractOpts) {
    return EulerEtokenContract__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  eulerPtokenContract({ address, network }: ContractOpts) {
    return EulerPtokenContract__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { EulerDtokenContract } from './ethers';
export type { EulerEtokenContract } from './ethers';
export type { EulerPtokenContract } from './ethers';
