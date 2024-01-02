import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { SiloIncentives__factory, SiloStipController__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class SiloFinanceViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  siloIncentives({ address, network }: ContractOpts) {
    return SiloIncentives__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  siloStipController({ address, network }: ContractOpts) {
    return SiloStipController__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
