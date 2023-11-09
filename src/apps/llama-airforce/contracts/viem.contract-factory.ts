import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  LlamaAirforceMerkleDistributor__factory,
  LlamaAirforceUnionVault__factory,
  LlamaAirforceUnionVaultPirex__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class LlamaAirforceViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  llamaAirforceMerkleDistributor({ address, network }: ContractOpts) {
    return LlamaAirforceMerkleDistributor__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  llamaAirforceUnionVault({ address, network }: ContractOpts) {
    return LlamaAirforceUnionVault__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  llamaAirforceUnionVaultPirex({ address, network }: ContractOpts) {
    return LlamaAirforceUnionVaultPirex__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
