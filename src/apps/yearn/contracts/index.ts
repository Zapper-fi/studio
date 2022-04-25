import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { YearnVault__factory } from './ethers';
import { YearnVaultV2__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class YearnContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  yearnVault({ address, network }: ContractOpts) {
    return YearnVault__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  yearnVaultV2({ address, network }: ContractOpts) {
    return YearnVaultV2__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { YearnVault } from './ethers';
export type { YearnVaultV2 } from './ethers';
