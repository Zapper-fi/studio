import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { EthereumStakingDeposit__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class EthereumStakingViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  ethereumStakingDeposit({ address, network }: ContractOpts) {
    return EthereumStakingDeposit__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
