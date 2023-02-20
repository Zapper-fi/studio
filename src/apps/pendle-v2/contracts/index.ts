import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { PendleMarket__factory } from './ethers';
import { PendleMarketFactory__factory } from './ethers';
import { PendlePrincipalToken__factory } from './ethers';
import { PendleVotingEscrow__factory } from './ethers';
import { PendleYieldContractFactory__factory } from './ethers';
import { PendleYieldToken__factory } from './ethers';
import { StandardizedYield__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class PendleV2ContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  pendleMarket({ address, network }: ContractOpts) {
    return PendleMarket__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pendleMarketFactory({ address, network }: ContractOpts) {
    return PendleMarketFactory__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pendlePrincipalToken({ address, network }: ContractOpts) {
    return PendlePrincipalToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pendleVotingEscrow({ address, network }: ContractOpts) {
    return PendleVotingEscrow__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pendleYieldContractFactory({ address, network }: ContractOpts) {
    return PendleYieldContractFactory__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pendleYieldToken({ address, network }: ContractOpts) {
    return PendleYieldToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  standardizedYield({ address, network }: ContractOpts) {
    return StandardizedYield__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { PendleMarket } from './ethers';
export type { PendleMarketFactory } from './ethers';
export type { PendlePrincipalToken } from './ethers';
export type { PendleVotingEscrow } from './ethers';
export type { PendleYieldContractFactory } from './ethers';
export type { PendleYieldToken } from './ethers';
export type { StandardizedYield } from './ethers';
