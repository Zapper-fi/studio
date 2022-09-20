import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { SynthetixAddressResolver__factory } from './ethers';
import { SynthetixLoan__factory } from './ethers';
import { SynthetixNetworkToken__factory } from './ethers';
import { SynthetixRewards__factory } from './ethers';
import { SynthetixSummaryUtil__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class SynthetixContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  synthetixAddressResolver({ address, network }: ContractOpts) {
    return SynthetixAddressResolver__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  synthetixLoan({ address, network }: ContractOpts) {
    return SynthetixLoan__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  synthetixNetworkToken({ address, network }: ContractOpts) {
    return SynthetixNetworkToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  synthetixRewards({ address, network }: ContractOpts) {
    return SynthetixRewards__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  synthetixSummaryUtil({ address, network }: ContractOpts) {
    return SynthetixSummaryUtil__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { SynthetixAddressResolver } from './ethers';
export type { SynthetixLoan } from './ethers';
export type { SynthetixNetworkToken } from './ethers';
export type { SynthetixRewards } from './ethers';
export type { SynthetixSummaryUtil } from './ethers';
