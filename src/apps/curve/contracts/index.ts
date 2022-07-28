import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { CurveAddressResolver__factory } from './ethers';
import { CurveChildLiquidityGauge__factory } from './ethers';
import { CurveController__factory } from './ethers';
import { CurveCryptoFactory__factory } from './ethers';
import { CurveCryptoRegistry__factory } from './ethers';
import { CurveDoubleGauge__factory } from './ethers';
import { CurveFactory__factory } from './ethers';
import { CurveFactoryPoolV2__factory } from './ethers';
import { CurveGauge__factory } from './ethers';
import { CurveGaugeV2__factory } from './ethers';
import { CurveNGauge__factory } from './ethers';
import { CurvePool__factory } from './ethers';
import { CurveRewardsOnlyGauge__factory } from './ethers';
import { CurveStableFactory__factory } from './ethers';
import { CurveStableRegistry__factory } from './ethers';
import { CurveVestingEscrow__factory } from './ethers';
import { CurveVotingEscrow__factory } from './ethers';
import { CurveVotingEscrowReward__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class CurveContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  curveAddressResolver({ address, network }: ContractOpts) {
    return CurveAddressResolver__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  curveChildLiquidityGauge({ address, network }: ContractOpts) {
    return CurveChildLiquidityGauge__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  curveController({ address, network }: ContractOpts) {
    return CurveController__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  curveCryptoFactory({ address, network }: ContractOpts) {
    return CurveCryptoFactory__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  curveCryptoRegistry({ address, network }: ContractOpts) {
    return CurveCryptoRegistry__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  curveDoubleGauge({ address, network }: ContractOpts) {
    return CurveDoubleGauge__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  curveFactory({ address, network }: ContractOpts) {
    return CurveFactory__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  curveFactoryPoolV2({ address, network }: ContractOpts) {
    return CurveFactoryPoolV2__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  curveGauge({ address, network }: ContractOpts) {
    return CurveGauge__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  curveGaugeV2({ address, network }: ContractOpts) {
    return CurveGaugeV2__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  curveNGauge({ address, network }: ContractOpts) {
    return CurveNGauge__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  curvePool({ address, network }: ContractOpts) {
    return CurvePool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  curveRewardsOnlyGauge({ address, network }: ContractOpts) {
    return CurveRewardsOnlyGauge__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  curveStableFactory({ address, network }: ContractOpts) {
    return CurveStableFactory__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  curveStableRegistry({ address, network }: ContractOpts) {
    return CurveStableRegistry__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  curveVestingEscrow({ address, network }: ContractOpts) {
    return CurveVestingEscrow__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  curveVotingEscrow({ address, network }: ContractOpts) {
    return CurveVotingEscrow__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  curveVotingEscrowReward({ address, network }: ContractOpts) {
    return CurveVotingEscrowReward__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { CurveAddressResolver } from './ethers';
export type { CurveChildLiquidityGauge } from './ethers';
export type { CurveController } from './ethers';
export type { CurveCryptoFactory } from './ethers';
export type { CurveCryptoRegistry } from './ethers';
export type { CurveDoubleGauge } from './ethers';
export type { CurveFactory } from './ethers';
export type { CurveFactoryPoolV2 } from './ethers';
export type { CurveGauge } from './ethers';
export type { CurveGaugeV2 } from './ethers';
export type { CurveNGauge } from './ethers';
export type { CurvePool } from './ethers';
export type { CurveRewardsOnlyGauge } from './ethers';
export type { CurveStableFactory } from './ethers';
export type { CurveStableRegistry } from './ethers';
export type { CurveVestingEscrow } from './ethers';
export type { CurveVotingEscrow } from './ethers';
export type { CurveVotingEscrowReward } from './ethers';
