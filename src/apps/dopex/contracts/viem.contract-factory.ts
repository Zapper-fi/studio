import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
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
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class DopexViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  dopexDpxSsov({ address, network }: ContractOpts) {
    return DopexDpxSsov__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  dopexDualRewardStaking({ address, network }: ContractOpts) {
    return DopexDualRewardStaking__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  dopexEthSsov({ address, network }: ContractOpts) {
    return DopexEthSsov__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  dopexGOhmSsov({ address, network }: ContractOpts) {
    return DopexGOhmSsov__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  dopexGmxSsov({ address, network }: ContractOpts) {
    return DopexGmxSsov__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  dopexOptionToken({ address, network }: ContractOpts) {
    return DopexOptionToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  dopexRdpxSsov({ address, network }: ContractOpts) {
    return DopexRdpxSsov__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  dopexRewardDistribution({ address, network }: ContractOpts) {
    return DopexRewardDistribution__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  dopexSingleRewardStaking({ address, network }: ContractOpts) {
    return DopexSingleRewardStaking__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  dopexSsovV3({ address, network }: ContractOpts) {
    return DopexSsovV3__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  dopexVotingEscrow({ address, network }: ContractOpts) {
    return DopexVotingEscrow__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  dopexVotingEscrowRewards({ address, network }: ContractOpts) {
    return DopexVotingEscrowRewards__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
