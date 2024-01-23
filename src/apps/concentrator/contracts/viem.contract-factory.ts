import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
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
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class ConcentratorViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  abcCvx({ address, network }: ContractOpts) {
    return AbcCvx__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  aladdinConcentratorAcrvVault({ address, network }: ContractOpts) {
    return AladdinConcentratorAcrvVault__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  aladdinConcentratorAfrxEthVault({ address, network }: ContractOpts) {
    return AladdinConcentratorAfrxEthVault__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  aladdinConcentratorAfxsVault({ address, network }: ContractOpts) {
    return AladdinConcentratorAfxsVault__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  aladdinConcentratorCompounder({ address, network }: ContractOpts) {
    return AladdinConcentratorCompounder__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  aladdinConcentratorLegacyVault({ address, network }: ContractOpts) {
    return AladdinConcentratorLegacyVault__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  aladdinConcentratorVe({ address, network }: ContractOpts) {
    return AladdinConcentratorVe__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  aladdinConcentratorVeRewards({ address, network }: ContractOpts) {
    return AladdinConcentratorVeRewards__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  aladdinConcentratorVest({ address, network }: ContractOpts) {
    return AladdinConcentratorVest__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
