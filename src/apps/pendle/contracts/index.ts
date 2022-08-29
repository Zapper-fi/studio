import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { PendleData__factory } from './ethers';
import { PendleForge__factory } from './ethers';
import { PendleMarket__factory } from './ethers';
import { PendleOwnershipToken__factory } from './ethers';
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
  pendleForge({ address, network }: ContractOpts) {
    return PendleForge__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pendleMarket({ address, network }: ContractOpts) {
    return PendleMarket__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pendleOwnershipToken({ address, network }: ContractOpts) {
    return PendleOwnershipToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pendleYieldToken({ address, network }: ContractOpts) {
    return PendleYieldToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { PendleData } from './ethers';
export type { PendleForge } from './ethers';
export type { PendleMarket } from './ethers';
export type { PendleOwnershipToken } from './ethers';
export type { PendleYieldToken } from './ethers';
