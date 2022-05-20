import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { BondTellerErc20__factory } from './ethers';
import { BondTellerEth__factory } from './ethers';
import { BondTellerMatic__factory } from './ethers';
import { Erc20__factory } from './ethers';
import { Scp__factory } from './ethers';
import { Solace__factory } from './ethers';
import { SolaceCoverProduct__factory } from './ethers';
import { SolaceCoverProductV2__factory } from './ethers';
import { StakingRewards__factory } from './ethers';
import { XSolacev1__factory } from './ethers';
import { XsLocker__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class SolaceContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  bondTellerErc20({ address, network }: ContractOpts) {
    return BondTellerErc20__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  bondTellerEth({ address, network }: ContractOpts) {
    return BondTellerEth__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  bondTellerMatic({ address, network }: ContractOpts) {
    return BondTellerMatic__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  erc20({ address, network }: ContractOpts) {
    return Erc20__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  scp({ address, network }: ContractOpts) {
    return Scp__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  solace({ address, network }: ContractOpts) {
    return Solace__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  solaceCoverProduct({ address, network }: ContractOpts) {
    return SolaceCoverProduct__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  solaceCoverProductV2({ address, network }: ContractOpts) {
    return SolaceCoverProductV2__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  stakingRewards({ address, network }: ContractOpts) {
    return StakingRewards__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  xSolacev1({ address, network }: ContractOpts) {
    return XSolacev1__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  xsLocker({ address, network }: ContractOpts) {
    return XsLocker__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { BondTellerErc20 } from './ethers';
export type { BondTellerEth } from './ethers';
export type { BondTellerMatic } from './ethers';
export type { Erc20 } from './ethers';
export type { Scp } from './ethers';
export type { Solace } from './ethers';
export type { SolaceCoverProduct } from './ethers';
export type { SolaceCoverProductV2 } from './ethers';
export type { StakingRewards } from './ethers';
export type { XSolacev1 } from './ethers';
export type { XsLocker } from './ethers';
