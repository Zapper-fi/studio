import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { RedactedBondDepository__factory } from './ethers';
import { RedactedRevenueLock__factory } from './ethers';
import { RedactedWxBtrfly__factory } from './ethers';
import { RedactedXBtrfly__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class RedactedCartelContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  redactedBondDepository({ address, network }: ContractOpts) {
    return RedactedBondDepository__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  redactedRevenueLock({ address, network }: ContractOpts) {
    return RedactedRevenueLock__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  redactedWxBtrfly({ address, network }: ContractOpts) {
    return RedactedWxBtrfly__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  redactedXBtrfly({ address, network }: ContractOpts) {
    return RedactedXBtrfly__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { RedactedBondDepository } from './ethers';
export type { RedactedRevenueLock } from './ethers';
export type { RedactedWxBtrfly } from './ethers';
export type { RedactedXBtrfly } from './ethers';
