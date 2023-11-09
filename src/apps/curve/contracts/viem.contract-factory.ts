import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  CurveAddressResolver__factory,
  CurveChildLiquidityGauge__factory,
  CurveChildLiquidityGaugeFactory__factory,
  CurveController__factory,
  CurveCryptoFactory__factory,
  CurveCryptoRegistry__factory,
  CurveDoubleGauge__factory,
  CurveFactory__factory,
  CurveFactoryPoolV2__factory,
  CurveGauge__factory,
  CurveGaugeV2__factory,
  CurveGaugeV6__factory,
  CurveNGauge__factory,
  CurvePool__factory,
  CurvePoolLegacy__factory,
  CurveRewardsOnlyGauge__factory,
  CurveStableFactory__factory,
  CurveStableRegistry__factory,
  CurveTricryptoFactory__factory,
  CurveTricryptoPool__factory,
  CurveVestingEscrow__factory,
  CurveVotingEscrow__factory,
  CurveVotingEscrowReward__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class CurveViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  curveAddressResolver({ address, network }: ContractOpts) {
    return CurveAddressResolver__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  curveChildLiquidityGauge({ address, network }: ContractOpts) {
    return CurveChildLiquidityGauge__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  curveChildLiquidityGaugeFactory({ address, network }: ContractOpts) {
    return CurveChildLiquidityGaugeFactory__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  curveController({ address, network }: ContractOpts) {
    return CurveController__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  curveCryptoFactory({ address, network }: ContractOpts) {
    return CurveCryptoFactory__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  curveCryptoRegistry({ address, network }: ContractOpts) {
    return CurveCryptoRegistry__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  curveDoubleGauge({ address, network }: ContractOpts) {
    return CurveDoubleGauge__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  curveFactory({ address, network }: ContractOpts) {
    return CurveFactory__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  curveFactoryPoolV2({ address, network }: ContractOpts) {
    return CurveFactoryPoolV2__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  curveGauge({ address, network }: ContractOpts) {
    return CurveGauge__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  curveGaugeV2({ address, network }: ContractOpts) {
    return CurveGaugeV2__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  curveGaugeV6({ address, network }: ContractOpts) {
    return CurveGaugeV6__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  curveNGauge({ address, network }: ContractOpts) {
    return CurveNGauge__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  curvePool({ address, network }: ContractOpts) {
    return CurvePool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  curvePoolLegacy({ address, network }: ContractOpts) {
    return CurvePoolLegacy__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  curveRewardsOnlyGauge({ address, network }: ContractOpts) {
    return CurveRewardsOnlyGauge__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  curveStableFactory({ address, network }: ContractOpts) {
    return CurveStableFactory__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  curveStableRegistry({ address, network }: ContractOpts) {
    return CurveStableRegistry__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  curveTricryptoFactory({ address, network }: ContractOpts) {
    return CurveTricryptoFactory__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  curveTricryptoPool({ address, network }: ContractOpts) {
    return CurveTricryptoPool__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  curveVestingEscrow({ address, network }: ContractOpts) {
    return CurveVestingEscrow__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  curveVotingEscrow({ address, network }: ContractOpts) {
    return CurveVotingEscrow__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  curveVotingEscrowReward({ address, network }: ContractOpts) {
    return CurveVotingEscrowReward__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
