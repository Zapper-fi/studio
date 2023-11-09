import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { ApxBtrfly__factory, ApxGlp__factory, ApxGmx__factory, PirexPxCvx__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class PirexViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  apxBtrfly({ address, network }: ContractOpts) {
    return ApxBtrfly__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  apxGlp({ address, network }: ContractOpts) {
    return ApxGlp__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  apxGmx({ address, network }: ContractOpts) {
    return ApxGmx__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  pirexPxCvx({ address, network }: ContractOpts) {
    return PirexPxCvx__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
