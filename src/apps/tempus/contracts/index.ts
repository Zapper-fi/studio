import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { Amm__factory } from './ethers';
import { Pool__factory } from './ethers';
import { PyToken__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class TempusContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  amm({ address, network }: ContractOpts) {
    return Amm__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pool({ address, network }: ContractOpts) {
    return Pool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  pyToken({ address, network }: ContractOpts) {
    return PyToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { Amm } from './ethers';
export type { Pool } from './ethers';
export type { PyToken } from './ethers';
