import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { SonneComptroller__factory, SonneSoToken__factory, SonneStakedSonne__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class SonneViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  sonneComptroller({ address, network }: ContractOpts) {
    return SonneComptroller__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  sonneSoToken({ address, network }: ContractOpts) {
    return SonneSoToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  sonneStakedSonne({ address, network }: ContractOpts) {
    return SonneStakedSonne__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
