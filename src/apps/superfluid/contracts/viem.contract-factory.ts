import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { VaultToken__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class SuperfluidViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  vaultToken({ address, network }: ContractOpts) {
    return VaultToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
