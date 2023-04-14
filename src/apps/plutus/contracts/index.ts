import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import {
  PlutusChef__factory,
  PlutusEpochStakingRewardsRolling__factory,
  PlutusFarmPlsArb__factory,
  PlutusFarmPlsDpx__factory,
  PlutusFarmPlsDpxV2__factory,
  PlutusFarmPlsJones__factory,
  PlutusFarmPlsJonesLp__factory,
  PlutusFarmPlsRdnt__factory,
  PlutusLock__factory,
  PlutusPlvGlp__factory,
  PlutusPrivateTge__factory,
  PlutusPrivateTgeVester__factory,
  PlutusRewardsDistroPlsDpx__factory,
  PlutusRewardsDistroPlsDpxV2__factory,
  PlutusRewardsDistroPlsJones__factory,
} from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class PlutusContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  plutusChef({ address, network }: ContractOpts) {
    return PlutusChef__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  plutusEpochStakingRewardsRolling({ address, network }: ContractOpts) {
    return PlutusEpochStakingRewardsRolling__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  plutusFarmPlsArb({ address, network }: ContractOpts) {
    return PlutusFarmPlsArb__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  plutusFarmPlsDpx({ address, network }: ContractOpts) {
    return PlutusFarmPlsDpx__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  plutusFarmPlsDpxV2({ address, network }: ContractOpts) {
    return PlutusFarmPlsDpxV2__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  plutusFarmPlsJones({ address, network }: ContractOpts) {
    return PlutusFarmPlsJones__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  plutusFarmPlsJonesLp({ address, network }: ContractOpts) {
    return PlutusFarmPlsJonesLp__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  plutusFarmPlsRdnt({ address, network }: ContractOpts) {
    return PlutusFarmPlsRdnt__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  plutusLock({ address, network }: ContractOpts) {
    return PlutusLock__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  plutusPlvGlp({ address, network }: ContractOpts) {
    return PlutusPlvGlp__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  plutusPrivateTge({ address, network }: ContractOpts) {
    return PlutusPrivateTge__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  plutusPrivateTgeVester({ address, network }: ContractOpts) {
    return PlutusPrivateTgeVester__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  plutusRewardsDistroPlsDpx({ address, network }: ContractOpts) {
    return PlutusRewardsDistroPlsDpx__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  plutusRewardsDistroPlsDpxV2({ address, network }: ContractOpts) {
    return PlutusRewardsDistroPlsDpxV2__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  plutusRewardsDistroPlsJones({ address, network }: ContractOpts) {
    return PlutusRewardsDistroPlsJones__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { PlutusChef } from './ethers';
export type { PlutusEpochStakingRewardsRolling } from './ethers';
export type { PlutusFarmPlsArb } from './ethers';
export type { PlutusFarmPlsDpx } from './ethers';
export type { PlutusFarmPlsDpxV2 } from './ethers';
export type { PlutusFarmPlsJones } from './ethers';
export type { PlutusFarmPlsJonesLp } from './ethers';
export type { PlutusFarmPlsRdnt } from './ethers';
export type { PlutusLock } from './ethers';
export type { PlutusPlvGlp } from './ethers';
export type { PlutusPrivateTge } from './ethers';
export type { PlutusPrivateTgeVester } from './ethers';
export type { PlutusRewardsDistroPlsDpx } from './ethers';
export type { PlutusRewardsDistroPlsDpxV2 } from './ethers';
export type { PlutusRewardsDistroPlsJones } from './ethers';
