import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { PendleData__factory } from './ethers';
import { PendleDexFactory__factory } from './ethers';
import { PendleDexPair__factory } from './ethers';
import { PendleForge__factory } from './ethers';
import { PendleLiquidityMining__factory } from './ethers';
import { PendleMarket__factory } from './ethers';
import { PendleOwnershipToken__factory } from './ethers';
import { PendleStaking__factory } from './ethers';
import { PendleStakingManager__factory } from './ethers';
import { PendleYieldToken__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class PendleContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  pendleData({ address, network }: ContractOpts) {
    return PendleData__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pendleDexFactory({ address, network }: ContractOpts) {
    return PendleDexFactory__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pendleDexPair({ address, network }: ContractOpts) {
    return PendleDexPair__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pendleForge({ address, network }: ContractOpts) {
    return PendleForge__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pendleLiquidityMining({ address, network }: ContractOpts) {
    return PendleLiquidityMining__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pendleMarket({ address, network }: ContractOpts) {
    return PendleMarket__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pendleOwnershipToken({ address, network }: ContractOpts) {
    return PendleOwnershipToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pendleStaking({ address, network }: ContractOpts) {
    return PendleStaking__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pendleStakingManager({ address, network }: ContractOpts) {
    return PendleStakingManager__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pendleYieldToken({ address, network }: ContractOpts) {
    return PendleYieldToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { PendleData } from './ethers';
export type { PendleDexFactory } from './ethers';
export type { PendleDexPair } from './ethers';
export type { PendleForge } from './ethers';
export type { PendleLiquidityMining } from './ethers';
export type { PendleMarket } from './ethers';
export type { PendleOwnershipToken } from './ethers';
export type { PendleStaking } from './ethers';
export type { PendleStakingManager } from './ethers';
export type { PendleYieldToken } from './ethers';
