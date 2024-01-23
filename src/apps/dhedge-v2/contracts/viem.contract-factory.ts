import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { DhedgeV2Factory__factory, DhedgeV2Staking__factory, DhedgeV2Token__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class DhedgeV2ViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  dhedgeV2Factory({ address, network }: ContractOpts) {
    return DhedgeV2Factory__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  dhedgeV2Staking({ address, network }: ContractOpts) {
    return DhedgeV2Staking__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  dhedgeV2Token({ address, network }: ContractOpts) {
    return DhedgeV2Token__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
