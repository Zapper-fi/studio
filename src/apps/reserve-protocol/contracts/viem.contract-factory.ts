import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  BasketHandler__factory,
  FacadeRead__factory,
  Main__factory,
  Rtoken__factory,
  StakedRsr__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class ReserveProtocolViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  basketHandler({ address, network }: ContractOpts) {
    return BasketHandler__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  facadeRead({ address, network }: ContractOpts) {
    return FacadeRead__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  main({ address, network }: ContractOpts) {
    return Main__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  rtoken({ address, network }: ContractOpts) {
    return Rtoken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  stakedRsr({ address, network }: ContractOpts) {
    return StakedRsr__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
