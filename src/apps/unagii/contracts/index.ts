import { Injectable, Inject } from '@nestjs/common';

import { AppToolkit } from '~app-toolkit/app-toolkit.service';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { UnagiiV2Vault__factory } from './ethers';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class UnagiiContractFactory extends ContractFactory {
  constructor(@Inject(AppToolkit) protected readonly appToolkit: AppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  unagiiV2Vault({ address, network }: ContractOpts) {
    return UnagiiV2Vault__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { UnagiiV2Vault } from './ethers';
