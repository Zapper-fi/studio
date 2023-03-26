import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { DolomiteMargin__factory, DolomiteMarginIsolationModeToken__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class DolomiteContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  dolomiteMargin({ address, network }: ContractOpts) {
    return DolomiteMargin__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  dolomiteMarginIsolationModeToken({ address, network }: ContractOpts) {
    return DolomiteMarginIsolationModeToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { DolomiteMargin } from './ethers';
export type { DolomiteMarginIsolationModeToken } from './ethers';
