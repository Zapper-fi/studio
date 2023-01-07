import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { SonneComptroller__factory, SonneSoToken__factory, SonneStakedSonne__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class SonneContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  sonneComptroller({ address, network }: ContractOpts) {
    return SonneComptroller__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  sonneSoToken({ address, network }: ContractOpts) {
    return SonneSoToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  sonneStakedSonne({ address, network }: ContractOpts) {
    return SonneStakedSonne__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { SonneComptroller } from './ethers';
export type { SonneSoToken } from './ethers';
export type { SonneStakedSonne } from './ethers';
