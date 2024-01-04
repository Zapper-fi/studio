import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  BalancerBoostedPool__factory,
  BalancerChildChainGaugeFactory__factory,
  BalancerComposableStablePool__factory,
  BalancerErc4626LinearPool__factory,
  BalancerFeeDistributor__factory,
  BalancerGauge__factory,
  BalancerMerkleOrchard__factory,
  BalancerMerkleRedeem__factory,
  BalancerPool__factory,
  BalancerStablePhantomPool__factory,
  BalancerVault__factory,
  BalancerVeBal__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class BalancerV2ViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  balancerBoostedPool({ address, network }: ContractOpts) {
    return BalancerBoostedPool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  balancerChildChainGaugeFactory({ address, network }: ContractOpts) {
    return BalancerChildChainGaugeFactory__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  balancerComposableStablePool({ address, network }: ContractOpts) {
    return BalancerComposableStablePool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  balancerErc4626LinearPool({ address, network }: ContractOpts) {
    return BalancerErc4626LinearPool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  balancerFeeDistributor({ address, network }: ContractOpts) {
    return BalancerFeeDistributor__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  balancerGauge({ address, network }: ContractOpts) {
    return BalancerGauge__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  balancerMerkleOrchard({ address, network }: ContractOpts) {
    return BalancerMerkleOrchard__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  balancerMerkleRedeem({ address, network }: ContractOpts) {
    return BalancerMerkleRedeem__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  balancerPool({ address, network }: ContractOpts) {
    return BalancerPool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  balancerStablePhantomPool({ address, network }: ContractOpts) {
    return BalancerStablePhantomPool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  balancerVault({ address, network }: ContractOpts) {
    return BalancerVault__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  balancerVeBal({ address, network }: ContractOpts) {
    return BalancerVeBal__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
