import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { AcrossV2HubPool__factory } from './ethers';
import { AcrossV2PoolToken__factory } from './ethers';
import { ArbDepositeBox__factory } from './ethers';
import { BadgerPool__factory } from './ethers';
import { BobaDepositeBox__factory } from './ethers';
import { BobaPool__factory } from './ethers';
import { DaiPool__factory } from './ethers';
import { EthArbMessenger__factory } from './ethers';
import { EthBridgeAdmin__factory } from './ethers';
import { EthSkinnySkinnyOptimisticOracle__factory } from './ethers';
import { OptDepositeBox__factory } from './ethers';
import { UmaPool__factory } from './ethers';
import { UsdcPool__factory } from './ethers';
import { WbtcPool__factory } from './ethers';
import { WethPool__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class AcrossContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  acrossV2HubPool({ address, network }: ContractOpts) {
    return AcrossV2HubPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  acrossV2PoolToken({ address, network }: ContractOpts) {
    return AcrossV2PoolToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  arbDepositeBox({ address, network }: ContractOpts) {
    return ArbDepositeBox__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  badgerPool({ address, network }: ContractOpts) {
    return BadgerPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  bobaDepositeBox({ address, network }: ContractOpts) {
    return BobaDepositeBox__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  bobaPool({ address, network }: ContractOpts) {
    return BobaPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  daiPool({ address, network }: ContractOpts) {
    return DaiPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  ethArbMessenger({ address, network }: ContractOpts) {
    return EthArbMessenger__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  ethBridgeAdmin({ address, network }: ContractOpts) {
    return EthBridgeAdmin__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  ethSkinnySkinnyOptimisticOracle({ address, network }: ContractOpts) {
    return EthSkinnySkinnyOptimisticOracle__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  optDepositeBox({ address, network }: ContractOpts) {
    return OptDepositeBox__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  umaPool({ address, network }: ContractOpts) {
    return UmaPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  usdcPool({ address, network }: ContractOpts) {
    return UsdcPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  wbtcPool({ address, network }: ContractOpts) {
    return WbtcPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  wethPool({ address, network }: ContractOpts) {
    return WethPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { AcrossV2HubPool } from './ethers';
export type { AcrossV2PoolToken } from './ethers';
export type { ArbDepositeBox } from './ethers';
export type { BadgerPool } from './ethers';
export type { BobaDepositeBox } from './ethers';
export type { BobaPool } from './ethers';
export type { DaiPool } from './ethers';
export type { EthArbMessenger } from './ethers';
export type { EthBridgeAdmin } from './ethers';
export type { EthSkinnySkinnyOptimisticOracle } from './ethers';
export type { OptDepositeBox } from './ethers';
export type { UmaPool } from './ethers';
export type { UsdcPool } from './ethers';
export type { WbtcPool } from './ethers';
export type { WethPool } from './ethers';
