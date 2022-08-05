import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { HectorDaoBondDepository__factory } from './ethers';
import { HectorDaoStakeBondDepository__factory } from './ethers';
import { HectorDaoStaked__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class HectorDaoContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  hectorDaoBondDepository({ address, network }: ContractOpts) {
    return HectorDaoBondDepository__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  hectorDaoStakeBondDepository({ address, network }: ContractOpts) {
    return HectorDaoStakeBondDepository__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  hectorDaoStaked({ address, network }: ContractOpts) {
    return HectorDaoStaked__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { HectorDaoBondDepository } from './ethers';
export type { HectorDaoStakeBondDepository } from './ethers';
export type { HectorDaoStaked } from './ethers';
