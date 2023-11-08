import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { RoboVault__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class RoboVaultViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  roboVault({ address, network }: ContractOpts) {
    return RoboVault__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
