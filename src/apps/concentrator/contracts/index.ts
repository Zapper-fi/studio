import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import {
  AbcCvx__factory,
  AladdinConcentratorAcrvVault__factory,
  AladdinConcentratorAfrxEthVault__factory,
  AladdinConcentratorAfxsVault__factory,
  AladdinConcentratorCompounder__factory,
  AladdinConcentratorLegacyVault__factory,
  AladdinConcentratorVe__factory,
  AladdinConcentratorVeRewards__factory,
  AladdinConcentratorVest__factory,
} from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class ConcentratorContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  abcCvx({ address, network }: ContractOpts) {
    return AbcCvx__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  aladdinConcentratorAcrvVault({ address, network }: ContractOpts) {
    return AladdinConcentratorAcrvVault__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  aladdinConcentratorAfrxEthVault({ address, network }: ContractOpts) {
    return AladdinConcentratorAfrxEthVault__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  aladdinConcentratorAfxsVault({ address, network }: ContractOpts) {
    return AladdinConcentratorAfxsVault__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  aladdinConcentratorCompounder({ address, network }: ContractOpts) {
    return AladdinConcentratorCompounder__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  aladdinConcentratorLegacyVault({ address, network }: ContractOpts) {
    return AladdinConcentratorLegacyVault__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  aladdinConcentratorVe({ address, network }: ContractOpts) {
    return AladdinConcentratorVe__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  aladdinConcentratorVeRewards({ address, network }: ContractOpts) {
    return AladdinConcentratorVeRewards__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  aladdinConcentratorVest({ address, network }: ContractOpts) {
    return AladdinConcentratorVest__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { AbcCvx } from './ethers';
export type { AladdinConcentratorAcrvVault } from './ethers';
export type { AladdinConcentratorAfrxEthVault } from './ethers';
export type { AladdinConcentratorAfxsVault } from './ethers';
export type { AladdinConcentratorCompounder } from './ethers';
export type { AladdinConcentratorLegacyVault } from './ethers';
export type { AladdinConcentratorVe } from './ethers';
export type { AladdinConcentratorVeRewards } from './ethers';
export type { AladdinConcentratorVest } from './ethers';
