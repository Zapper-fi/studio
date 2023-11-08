import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { UnagiiUtoken__factory, UnagiiV2Vault__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class UnagiiViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  unagiiUtoken({ address, network }: ContractOpts) {
    return UnagiiUtoken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  unagiiV2Vault({ address, network }: ContractOpts) {
    return UnagiiV2Vault__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
