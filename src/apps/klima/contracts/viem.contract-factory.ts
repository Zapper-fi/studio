import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  KlimaBondDepository__factory,
  KlimaDistributor__factory,
  KlimaSKlima__factory,
  KlimaWsKlima__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class KlimaViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  klimaBondDepository({ address, network }: ContractOpts) {
    return KlimaBondDepository__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  klimaDistributor({ address, network }: ContractOpts) {
    return KlimaDistributor__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  klimaSKlima({ address, network }: ContractOpts) {
    return KlimaSKlima__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  klimaWsKlima({ address, network }: ContractOpts) {
    return KlimaWsKlima__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
