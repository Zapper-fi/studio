import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { OokiIToken__factory } from './ethers';
import { OokiTokenRegistry__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class OokiContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  ookiIToken({ address, network }: ContractOpts) {
    return OokiIToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  ookiTokenRegistry({ address, network }: ContractOpts) {
    return OokiTokenRegistry__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { OokiIToken } from './ethers';
export type { OokiTokenRegistry } from './ethers';
