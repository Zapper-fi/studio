import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { GoldfinchSeniorBond__factory } from './ethers';
import { GoldfinchSeniorPool__factory } from './ethers';
import { GoldfinchVault__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class GoldfinchContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  goldfinchSeniorBond({ address, network }: ContractOpts) {
    return GoldfinchSeniorBond__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  goldfinchSeniorPool({ address, network }: ContractOpts) {
    return GoldfinchSeniorPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  goldfinchVault({ address, network }: ContractOpts) {
    return GoldfinchVault__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { GoldfinchSeniorBond } from './ethers';
export type { GoldfinchSeniorPool } from './ethers';
export type { GoldfinchVault } from './ethers';
