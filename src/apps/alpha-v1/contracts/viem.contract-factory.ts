import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { AlphaBank__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class AlphaV1ViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  alphaBank({ address, network }: ContractOpts) {
    return AlphaBank__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
