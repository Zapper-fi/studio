import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { CaskVaultToken__factory } from './ethers';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class CaskProtocolContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  caskVaultToken({ address, network }: ContractOpts) {
    return CaskVaultToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { CaskVaultToken } from './ethers';
