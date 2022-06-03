import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { LlamaAirforceMerkleDistributor__factory } from './ethers';
import { LlamaAirforceUnionVault__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class LlamaAirforceContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  llamaAirforceMerkleDistributor({ address, network }: ContractOpts) {
    return LlamaAirforceMerkleDistributor__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  llamaAirforceUnionVault({ address, network }: ContractOpts) {
    return LlamaAirforceUnionVault__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { LlamaAirforceMerkleDistributor } from './ethers';
export type { LlamaAirforceUnionVault } from './ethers';
