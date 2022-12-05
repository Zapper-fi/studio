import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { PlatypusFinanceMasterPlatypusV1__factory } from './ethers';
import { PlatypusFinanceMasterPlatypusV2__factory } from './ethers';
import { PlatypusFinancePool__factory } from './ethers';
import { PlatypusFinancePoolToken__factory } from './ethers';
import { PlatypusFinanceVotingEscrow__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class PlatypusFinanceContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  platypusFinanceMasterPlatypusV1({ address, network }: ContractOpts) {
    return PlatypusFinanceMasterPlatypusV1__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  platypusFinanceMasterPlatypusV2({ address, network }: ContractOpts) {
    return PlatypusFinanceMasterPlatypusV2__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  platypusFinancePool({ address, network }: ContractOpts) {
    return PlatypusFinancePool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  platypusFinancePoolToken({ address, network }: ContractOpts) {
    return PlatypusFinancePoolToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  platypusFinanceVotingEscrow({ address, network }: ContractOpts) {
    return PlatypusFinanceVotingEscrow__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { PlatypusFinanceMasterPlatypusV1 } from './ethers';
export type { PlatypusFinanceMasterPlatypusV2 } from './ethers';
export type { PlatypusFinancePool } from './ethers';
export type { PlatypusFinancePoolToken } from './ethers';
export type { PlatypusFinanceVotingEscrow } from './ethers';
