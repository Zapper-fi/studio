import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { BeefyBoostVault__factory, BeefyVaultToken__factory } from './ethers';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class BeefyContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  beefyBoostVault({ address, network }: ContractOpts) {
    return BeefyBoostVault__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  beefyVaultToken({ address, network }: ContractOpts) {
    return BeefyVaultToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { BeefyBoostVault } from './ethers';
export type { BeefyVaultToken } from './ethers';