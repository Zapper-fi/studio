import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import {
  DopexDpxSsov__factory,
  DopexDualRewardStaking__factory,
  DopexEthSsov__factory,
  DopexGOhmSsov__factory,
  DopexGmxSsov__factory,
  DopexOptionToken__factory,
  DopexRdpxSsov__factory,
  DopexRewardDistribution__factory,
  DopexSingleRewardStaking__factory,
  DopexSsovV3__factory,
  DopexVotingEscrow__factory,
  DopexVotingEscrowRewards__factory,
} from './ethers';

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
  dopexDualRewardStaking({ address, network }: ContractOpts) {
    return DopexDualRewardStaking__factory.connect(address, this.appToolkit.getNetworkProvider(network));
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
  dopexOptionToken({ address, network }: ContractOpts) {
    return DopexOptionToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  dopexRdpxSsov({ address, network }: ContractOpts) {
    return DopexRdpxSsov__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  dopexRewardDistribution({ address, network }: ContractOpts) {
    return DopexRewardDistribution__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  dopexSingleRewardStaking({ address, network }: ContractOpts) {
    return DopexSingleRewardStaking__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  dopexSsovV3({ address, network }: ContractOpts) {
    return DopexSsovV3__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  dopexVotingEscrow({ address, network }: ContractOpts) {
    return DopexVotingEscrow__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  dopexVotingEscrowRewards({ address, network }: ContractOpts) {
    return DopexVotingEscrowRewards__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { DopexDpxSsov } from './ethers';
export type { DopexDualRewardStaking } from './ethers';
export type { DopexEthSsov } from './ethers';
export type { DopexGOhmSsov } from './ethers';
export type { DopexGmxSsov } from './ethers';
export type { DopexOptionToken } from './ethers';
export type { DopexRdpxSsov } from './ethers';
export type { DopexRewardDistribution } from './ethers';
export type { DopexSingleRewardStaking } from './ethers';
export type { DopexSsovV3 } from './ethers';
export type { DopexVotingEscrow } from './ethers';
export type { DopexVotingEscrowRewards } from './ethers';
