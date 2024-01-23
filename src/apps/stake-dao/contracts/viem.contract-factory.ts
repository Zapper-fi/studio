import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  StakeDaoCurvePool__factory,
  StakeDaoFarm__factory,
  StakeDaoGauge__factory,
  StakeDaoMultiGauge__factory,
  StakeDaoVault__factory,
  StakeDaoVotingEscrow__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class StakeDaoViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  stakeDaoCurvePool({ address, network }: ContractOpts) {
    return StakeDaoCurvePool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  stakeDaoFarm({ address, network }: ContractOpts) {
    return StakeDaoFarm__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  stakeDaoGauge({ address, network }: ContractOpts) {
    return StakeDaoGauge__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  stakeDaoMultiGauge({ address, network }: ContractOpts) {
    return StakeDaoMultiGauge__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  stakeDaoVault({ address, network }: ContractOpts) {
    return StakeDaoVault__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  stakeDaoVotingEscrow({ address, network }: ContractOpts) {
    return StakeDaoVotingEscrow__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
