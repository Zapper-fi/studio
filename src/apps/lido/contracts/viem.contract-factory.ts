import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { LidoSteth__factory, LidoStethEthOracle__factory, LidoStksm__factory, LidoWsteth__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class LidoViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  lidoSteth({ address, network }: ContractOpts) {
    return LidoSteth__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  lidoStethEthOracle({ address, network }: ContractOpts) {
    return LidoStethEthOracle__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  lidoStksm({ address, network }: ContractOpts) {
    return LidoStksm__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  lidoWsteth({ address, network }: ContractOpts) {
    return LidoWsteth__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
