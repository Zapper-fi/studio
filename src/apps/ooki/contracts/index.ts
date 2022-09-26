import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { IPriceFeeds__factory } from './ethers';
import { IStakingV2__factory } from './ethers';
import { IToken__factory } from './ethers';
import { IbZx__factory } from './ethers';
import { TokenRegistry__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class OokiContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  iPriceFeeds({ address, network }: ContractOpts) {
    return IPriceFeeds__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  iStakingV2({ address, network }: ContractOpts) {
    return IStakingV2__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  iToken({ address, network }: ContractOpts) {
    return IToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  ibZx({ address, network }: ContractOpts) {
    return IbZx__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  tokenRegistry({ address, network }: ContractOpts) {
    return TokenRegistry__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { IPriceFeeds } from './ethers';
export type { IStakingV2 } from './ethers';
export type { IToken } from './ethers';
export type { IbZx } from './ethers';
export type { TokenRegistry } from './ethers';
