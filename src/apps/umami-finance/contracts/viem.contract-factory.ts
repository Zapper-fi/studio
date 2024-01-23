import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { UmamiFinanceMarinate__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class UmamiFinanceViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  umamiFinanceMarinate({ address, network }: ContractOpts) {
    return UmamiFinanceMarinate__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
