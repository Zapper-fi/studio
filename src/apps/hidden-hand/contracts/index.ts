import { Injectable, Inject } from '@nestjs/common';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';

import { NetworkProviderService } from '~network-provider/network-provider.service';
import { Network } from '~types/network.interface';

import { HiddenHandRewardDistributor__factory } from './ethers';
import type { HiddenHandRewardDistributor } from './ethers';
import { ContractFactory } from '~contract/contracts';
// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class HiddenHandContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  hiddenHandRewardDistributor({ address, network }: ContractOpts) {
    return HiddenHandRewardDistributor__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { HiddenHandRewardDistributor } from './ethers';
