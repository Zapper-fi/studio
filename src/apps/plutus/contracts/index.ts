import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { PlutusEpochStakingRewardsRolling__factory } from './ethers';
import { PlutusFarmPls__factory } from './ethers';
import { PlutusFarmPlsDpx__factory } from './ethers';
import { PlutusFarmPlsDpxLp__factory } from './ethers';
import { PlutusFarmPlsDpxV2__factory } from './ethers';
import { PlutusFarmPlsJones__factory } from './ethers';
import { PlutusFarmPlsJonesLp__factory } from './ethers';
import { PlutusLock__factory } from './ethers';
import { PlutusPrivateTge__factory } from './ethers';
import { PlutusPrivateTgeVester__factory } from './ethers';
import { PlutusRewardsDistroPlsDpx__factory } from './ethers';
import { PlutusRewardsDistroPlsDpxV2__factory } from './ethers';
import { PlutusRewardsDistroPlsJones__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class PlutusContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  plutusEpochStakingRewardsRolling({ address, network }: ContractOpts) {
    return PlutusEpochStakingRewardsRolling__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  plutusFarmPls({ address, network }: ContractOpts) {
    return PlutusFarmPls__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  plutusFarmPlsDpx({ address, network }: ContractOpts) {
    return PlutusFarmPlsDpx__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  plutusFarmPlsDpxLp({ address, network }: ContractOpts) {
    return PlutusFarmPlsDpxLp__factory.connect(address, this.appToolkit.getNetworkProvider(network));
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
  plutusLock({ address, network }: ContractOpts) {
    return PlutusLock__factory.connect(address, this.appToolkit.getNetworkProvider(network));
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

export type { PlutusEpochStakingRewardsRolling } from './ethers';
export type { PlutusFarmPls } from './ethers';
export type { PlutusFarmPlsDpx } from './ethers';
export type { PlutusFarmPlsDpxLp } from './ethers';
export type { PlutusFarmPlsDpxV2 } from './ethers';
export type { PlutusFarmPlsJones } from './ethers';
export type { PlutusFarmPlsJonesLp } from './ethers';
export type { PlutusLock } from './ethers';
export type { PlutusPrivateTge } from './ethers';
export type { PlutusPrivateTgeVester } from './ethers';
export type { PlutusRewardsDistroPlsDpx } from './ethers';
export type { PlutusRewardsDistroPlsDpxV2 } from './ethers';
export type { PlutusRewardsDistroPlsJones } from './ethers';
