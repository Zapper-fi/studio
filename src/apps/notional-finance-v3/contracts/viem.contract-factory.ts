import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { NotionalFCash__factory, NotionalPCash__factory, NotionalView__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class NotionalFinanceV3ViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  notionalFCash({ address, network }: ContractOpts) {
    return NotionalFCash__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  notionalPCash({ address, network }: ContractOpts) {
    return NotionalPCash__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  notionalView({ address, network }: ContractOpts) {
    return NotionalView__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
