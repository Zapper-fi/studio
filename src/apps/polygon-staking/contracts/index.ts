import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { PolygonStakeManager__factory } from './ethers';
import { PolygonValidatorShare__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class PolygonStakingContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  polygonStakeManager({ address, network }: ContractOpts) {
    return PolygonStakeManager__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  polygonValidatorShare({ address, network }: ContractOpts) {
    return PolygonValidatorShare__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { PolygonStakeManager } from './ethers';
export type { PolygonValidatorShare } from './ethers';
