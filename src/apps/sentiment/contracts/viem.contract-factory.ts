import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { SentimentLToken__factory, SentimentRegistry__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class SentimentViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  sentimentLToken({ address, network }: ContractOpts) {
    return SentimentLToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  sentimentRegistry({ address, network }: ContractOpts) {
    return SentimentRegistry__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
