import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { SvxaiVault__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class SideshiftViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  svxaiVault({ address, network }: ContractOpts) {
    return SvxaiVault__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
