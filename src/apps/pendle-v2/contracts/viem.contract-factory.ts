import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  PendleMarket__factory,
  PendleMarketFactory__factory,
  PendlePrincipalToken__factory,
  PendleVotingEscrow__factory,
  PendleYieldContractFactory__factory,
  PendleYieldToken__factory,
  StandardizedYield__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class PendleV2ViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  pendleMarket({ address, network }: ContractOpts) {
    return PendleMarket__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  pendleMarketFactory({ address, network }: ContractOpts) {
    return PendleMarketFactory__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  pendlePrincipalToken({ address, network }: ContractOpts) {
    return PendlePrincipalToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  pendleVotingEscrow({ address, network }: ContractOpts) {
    return PendleVotingEscrow__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  pendleYieldContractFactory({ address, network }: ContractOpts) {
    return PendleYieldContractFactory__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  pendleYieldToken({ address, network }: ContractOpts) {
    return PendleYieldToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  standardizedYield({ address, network }: ContractOpts) {
    return StandardizedYield__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
