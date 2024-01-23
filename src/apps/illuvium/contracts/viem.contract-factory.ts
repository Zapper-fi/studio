import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  IlluviumCorePool__factory,
  IlluviumIlvPoolV2__factory,
  IlluviumSIlv2__factory,
  IlluviumSushiLpPoolV2__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class IlluviumViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  illuviumCorePool({ address, network }: ContractOpts) {
    return IlluviumCorePool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  illuviumIlvPoolV2({ address, network }: ContractOpts) {
    return IlluviumIlvPoolV2__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  illuviumSIlv2({ address, network }: ContractOpts) {
    return IlluviumSIlv2__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  illuviumSushiLpPoolV2({ address, network }: ContractOpts) {
    return IlluviumSushiLpPoolV2__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
