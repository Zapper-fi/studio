import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { SentimentAccount__factory, SentimentLToken__factory, SentimentRegistry__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class SentimentContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  sentimentAccount({ address, network }: ContractOpts) {
    return SentimentAccount__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  sentimentLToken({ address, network }: ContractOpts) {
    return SentimentLToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  sentimentRegistry({ address, network }: ContractOpts) {
    return SentimentRegistry__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { SentimentAccount } from './ethers';
export type { SentimentLToken } from './ethers';
export type { SentimentRegistry } from './ethers';
