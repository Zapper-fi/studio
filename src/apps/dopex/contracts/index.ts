import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { DopexDpxSsov__factory } from './ethers';
import { DopexEthSsov__factory } from './ethers';
import { DopexGOhmSsov__factory } from './ethers';
import { DopexGmxSsov__factory } from './ethers';
import { DopexRdpxSsov__factory } from './ethers';
import { DopexRewardDistribution__factory } from './ethers';
import { DopexStaking__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class DopexContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  dopexDpxSsov({ address, network }: ContractOpts) {
    return DopexDpxSsov__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  dopexEthSsov({ address, network }: ContractOpts) {
    return DopexEthSsov__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  dopexGOhmSsov({ address, network }: ContractOpts) {
    return DopexGOhmSsov__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  dopexGmxSsov({ address, network }: ContractOpts) {
    return DopexGmxSsov__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  dopexRdpxSsov({ address, network }: ContractOpts) {
    return DopexRdpxSsov__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  dopexRewardDistribution({ address, network }: ContractOpts) {
    return DopexRewardDistribution__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  dopexStaking({ address, network }: ContractOpts) {
    return DopexStaking__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { DopexDpxSsov } from './ethers';
export type { DopexEthSsov } from './ethers';
export type { DopexGOhmSsov } from './ethers';
export type { DopexGmxSsov } from './ethers';
export type { DopexRdpxSsov } from './ethers';
export type { DopexRewardDistribution } from './ethers';
export type { DopexStaking } from './ethers';
