import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { BeefyBoostVault__factory, BeefyVaultToken__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class BeefyViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  beefyBoostVault({ address, network }: ContractOpts) {
    return BeefyBoostVault__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  beefyVaultToken({ address, network }: ContractOpts) {
    return BeefyVaultToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
