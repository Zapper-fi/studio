import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  RedactedBondDepository__factory,
  RedactedRevenueLock__factory,
  RedactedRewardDistributor__factory,
  RedactedWxBtrfly__factory,
  RedactedXBtrfly__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class RedactedCartelViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  redactedBondDepository({ address, network }: ContractOpts) {
    return RedactedBondDepository__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  redactedRevenueLock({ address, network }: ContractOpts) {
    return RedactedRevenueLock__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  redactedRewardDistributor({ address, network }: ContractOpts) {
    return RedactedRewardDistributor__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  redactedWxBtrfly({ address, network }: ContractOpts) {
    return RedactedWxBtrfly__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  redactedXBtrfly({ address, network }: ContractOpts) {
    return RedactedXBtrfly__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
