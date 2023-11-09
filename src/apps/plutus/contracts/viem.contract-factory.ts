import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
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
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class PlutusViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  plutusChef({ address, network }: ContractOpts) {
    return PlutusChef__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  plutusEpochStakingRewardsRolling({ address, network }: ContractOpts) {
    return PlutusEpochStakingRewardsRolling__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  plutusFarmPlsArb({ address, network }: ContractOpts) {
    return PlutusFarmPlsArb__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  plutusFarmPlsDpx({ address, network }: ContractOpts) {
    return PlutusFarmPlsDpx__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  plutusFarmPlsDpxV2({ address, network }: ContractOpts) {
    return PlutusFarmPlsDpxV2__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  plutusFarmPlsJones({ address, network }: ContractOpts) {
    return PlutusFarmPlsJones__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  plutusFarmPlsJonesLp({ address, network }: ContractOpts) {
    return PlutusFarmPlsJonesLp__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  plutusFarmPlsRdnt({ address, network }: ContractOpts) {
    return PlutusFarmPlsRdnt__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  plutusLock({ address, network }: ContractOpts) {
    return PlutusLock__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  plutusPlvGlp({ address, network }: ContractOpts) {
    return PlutusPlvGlp__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  plutusPrivateTge({ address, network }: ContractOpts) {
    return PlutusPrivateTge__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  plutusPrivateTgeVester({ address, network }: ContractOpts) {
    return PlutusPrivateTgeVester__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  plutusRewardsDistroPlsDpx({ address, network }: ContractOpts) {
    return PlutusRewardsDistroPlsDpx__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  plutusRewardsDistroPlsDpxV2({ address, network }: ContractOpts) {
    return PlutusRewardsDistroPlsDpxV2__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  plutusRewardsDistroPlsJones({ address, network }: ContractOpts) {
    return PlutusRewardsDistroPlsJones__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
