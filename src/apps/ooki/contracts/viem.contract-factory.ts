import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { OokiIToken__factory, OokiTokenRegistry__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class OokiViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  ookiIToken({ address, network }: ContractOpts) {
    return OokiIToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  ookiTokenRegistry({ address, network }: ContractOpts) {
    return OokiTokenRegistry__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
