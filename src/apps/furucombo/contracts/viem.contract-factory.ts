import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { FurucomboFundShareToken__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class FurucomboViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  furucomboFundShareToken({ address, network }: ContractOpts) {
    return FurucomboFundShareToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
