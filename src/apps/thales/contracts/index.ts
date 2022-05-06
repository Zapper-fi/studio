import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { EscrowThales__factory } from './ethers';
import { GuniPool__factory } from './ethers';
import { PositionalMarketManager__factory } from './ethers';
import { StakingThales__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class ThalesContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  escrowThales({ address, network }: ContractOpts) {
    return EscrowThales__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  guniPool({ address, network }: ContractOpts) {
    return GuniPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  positionalMarketManager({ address, network }: ContractOpts) {
    return PositionalMarketManager__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  stakingThales({ address, network }: ContractOpts) {
    return StakingThales__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { EscrowThales } from './ethers';
export type { GuniPool } from './ethers';
export type { PositionalMarketManager } from './ethers';
export type { StakingThales } from './ethers';
