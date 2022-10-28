import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { LpYCrv__factory } from './ethers';
import { StakedYCrv__factory } from './ethers';
import { YearnGovernance__factory } from './ethers';
import { YearnVault__factory } from './ethers';
import { YearnVaultV2__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class YearnContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  lpYCrv({ address, network }: ContractOpts) {
    return LpYCrv__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  stakedYCrv({ address, network }: ContractOpts) {
    return StakedYCrv__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  yearnGovernance({ address, network }: ContractOpts) {
    return YearnGovernance__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  yearnVault({ address, network }: ContractOpts) {
    return YearnVault__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  yearnVaultV2({ address, network }: ContractOpts) {
    return YearnVaultV2__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { LpYCrv } from './ethers';
export type { StakedYCrv } from './ethers';
export type { YearnGovernance } from './ethers';
export type { YearnVault } from './ethers';
export type { YearnVaultV2 } from './ethers';
