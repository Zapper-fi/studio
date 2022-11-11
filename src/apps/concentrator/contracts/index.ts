import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { AladdinConcentratorAcrvVault__factory } from './ethers';
import { AladdinConcentratorLegacyVault__factory } from './ethers';
import { AladdinConcentratorVe__factory } from './ethers';
import { AladdinConcentratorVeRewards__factory } from './ethers';
import { AladdinCrv__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class ConcentratorContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  aladdinConcentratorAcrvVault({ address, network }: ContractOpts) {
    return AladdinConcentratorAcrvVault__factory.connect(address, this.appToolkit.getNetworkProvider(network));
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
  aladdinCrv({ address, network }: ContractOpts) {
    return AladdinCrv__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { AladdinConcentratorAcrvVault } from './ethers';
export type { AladdinConcentratorLegacyVault } from './ethers';
export type { AladdinConcentratorVe } from './ethers';
export type { AladdinConcentratorVeRewards } from './ethers';
export type { AladdinCrv } from './ethers';
