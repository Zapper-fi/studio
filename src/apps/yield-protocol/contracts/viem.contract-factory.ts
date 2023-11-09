import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  YieldProtocolCauldron__factory,
  YieldProtocolLadle__factory,
  YieldProtocolLendToken__factory,
  YieldProtocolPool__factory,
  YieldProtocolPoolToken__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class YieldProtocolViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  yieldProtocolCauldron({ address, network }: ContractOpts) {
    return YieldProtocolCauldron__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  yieldProtocolLadle({ address, network }: ContractOpts) {
    return YieldProtocolLadle__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  yieldProtocolLendToken({ address, network }: ContractOpts) {
    return YieldProtocolLendToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  yieldProtocolPool({ address, network }: ContractOpts) {
    return YieldProtocolPool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  yieldProtocolPoolToken({ address, network }: ContractOpts) {
    return YieldProtocolPoolToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
