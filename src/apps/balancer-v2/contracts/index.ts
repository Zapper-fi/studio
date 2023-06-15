import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import {
  BalancerBoostedPool__factory,
  BalancerChildChainGaugeFactory__factory,
  BalancerComposableStablePool__factory,
  BalancerErc4626LinearPool__factory,
  BalancerGauge__factory,
  BalancerMerkleOrchard__factory,
  BalancerMerkleRedeem__factory,
  BalancerPool__factory,
  BalancerStablePhantomPool__factory,
  BalancerStaticAToken__factory,
  BalancerVault__factory,
  BalancerVeBal__factory,
  BalancerWrappedAaveToken__factory,
} from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class BalancerV2ContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  balancerBoostedPool({ address, network }: ContractOpts) {
    return BalancerBoostedPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  balancerChildChainGaugeFactory({ address, network }: ContractOpts) {
    return BalancerChildChainGaugeFactory__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  balancerComposableStablePool({ address, network }: ContractOpts) {
    return BalancerComposableStablePool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  balancerErc4626LinearPool({ address, network }: ContractOpts) {
    return BalancerErc4626LinearPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  balancerGauge({ address, network }: ContractOpts) {
    return BalancerGauge__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  balancerMerkleOrchard({ address, network }: ContractOpts) {
    return BalancerMerkleOrchard__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  balancerMerkleRedeem({ address, network }: ContractOpts) {
    return BalancerMerkleRedeem__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  balancerPool({ address, network }: ContractOpts) {
    return BalancerPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  balancerStablePhantomPool({ address, network }: ContractOpts) {
    return BalancerStablePhantomPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  balancerStaticAToken({ address, network }: ContractOpts) {
    return BalancerStaticAToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  balancerVault({ address, network }: ContractOpts) {
    return BalancerVault__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  balancerVeBal({ address, network }: ContractOpts) {
    return BalancerVeBal__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  balancerWrappedAaveToken({ address, network }: ContractOpts) {
    return BalancerWrappedAaveToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { BalancerBoostedPool } from './ethers';
export type { BalancerChildChainGaugeFactory } from './ethers';
export type { BalancerComposableStablePool } from './ethers';
export type { BalancerErc4626LinearPool } from './ethers';
export type { BalancerGauge } from './ethers';
export type { BalancerMerkleOrchard } from './ethers';
export type { BalancerMerkleRedeem } from './ethers';
export type { BalancerPool } from './ethers';
export type { BalancerStablePhantomPool } from './ethers';
export type { BalancerStaticAToken } from './ethers';
export type { BalancerVault } from './ethers';
export type { BalancerVeBal } from './ethers';
export type { BalancerWrappedAaveToken } from './ethers';
