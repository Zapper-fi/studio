import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { TenderFarm__factory, TenderSwap__factory, TenderToken__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class TenderizeViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  tenderFarm({ address, network }: ContractOpts) {
    return TenderFarm__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  tenderSwap({ address, network }: ContractOpts) {
    return TenderSwap__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  tenderToken({ address, network }: ContractOpts) {
    return TenderToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
