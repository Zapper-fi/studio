import { Injectable, Inject } from '@nestjs/common';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';

import { NetworkProviderService } from '~network-provider/network-provider.service';
import { Network } from '~types/network.interface';

import { ContractFactory } from '~contract/contracts';
// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class AgaveContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }
}
