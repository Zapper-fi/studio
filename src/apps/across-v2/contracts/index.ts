import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { ArbSpokePool__factory } from './ethers';
import { BobaSpokePool__factory } from './ethers';
import { EthHubPool__factory } from './ethers';
import { EthSpokePool__factory } from './ethers';
import { OptSpokePool__factory } from './ethers';
import { PolSpokePool__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class AcrossV2ContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  arbSpokePool({ address, network }: ContractOpts) {
    return ArbSpokePool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  bobaSpokePool({ address, network }: ContractOpts) {
    return BobaSpokePool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  ethHubPool({ address, network }: ContractOpts) {
    return EthHubPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  ethSpokePool({ address, network }: ContractOpts) {
    return EthSpokePool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  optSpokePool({ address, network }: ContractOpts) {
    return OptSpokePool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  polSpokePool({ address, network }: ContractOpts) {
    return PolSpokePool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { ArbSpokePool } from './ethers';
export type { BobaSpokePool } from './ethers';
export type { EthHubPool } from './ethers';
export type { EthSpokePool } from './ethers';
export type { OptSpokePool } from './ethers';
export type { PolSpokePool } from './ethers';
