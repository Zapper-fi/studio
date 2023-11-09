import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { SvxaiVault__factory } from './ethers';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class SideshiftContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  svxaiVault({ address, network }: ContractOpts) {
    return SvxaiVault__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { SvxaiVault } from './ethers';
