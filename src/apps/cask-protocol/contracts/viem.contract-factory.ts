import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { CaskVaultToken__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class CaskProtocolViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  caskVaultToken({ address, network }: ContractOpts) {
    return CaskVaultToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
