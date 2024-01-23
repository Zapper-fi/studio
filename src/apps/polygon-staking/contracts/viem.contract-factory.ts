import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { PolygonStakeManager__factory, PolygonValidatorShare__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class PolygonStakingViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  polygonStakeManager({ address, network }: ContractOpts) {
    return PolygonStakeManager__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  polygonValidatorShare({ address, network }: ContractOpts) {
    return PolygonValidatorShare__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
