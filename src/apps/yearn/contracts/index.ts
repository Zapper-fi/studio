import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { YearnGovernance__factory } from './ethers';
import { YearnLpYCrv__factory } from './ethers';
import { YearnStakedYCrv__factory } from './ethers';
import { YearnVault__factory } from './ethers';
import { YearnVaultV2__factory } from './ethers';
import { YearnYCrv__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class YearnContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  yearnGovernance({ address, network }: ContractOpts) {
    return YearnGovernance__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  yearnLpYCrv({ address, network }: ContractOpts) {
    return YearnLpYCrv__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  yearnStakedYCrv({ address, network }: ContractOpts) {
    return YearnStakedYCrv__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  yearnVault({ address, network }: ContractOpts) {
    return YearnVault__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  yearnVaultV2({ address, network }: ContractOpts) {
    return YearnVaultV2__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  yearnYCrv({ address, network }: ContractOpts) {
    return YearnYCrv__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { YearnGovernance } from './ethers';
export type { YearnLpYCrv } from './ethers';
export type { YearnStakedYCrv } from './ethers';
export type { YearnVault } from './ethers';
export type { YearnVaultV2 } from './ethers';
export type { YearnYCrv } from './ethers';
