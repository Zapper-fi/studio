import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { TempusAmm__factory } from './ethers';
import { TempusPool__factory } from './ethers';
import { TempusPyToken__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class TempusContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  tempusAmm({ address, network }: ContractOpts) {
    return TempusAmm__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  tempusPool({ address, network }: ContractOpts) {
    return TempusPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  tempusPyToken({ address, network }: ContractOpts) {
    return TempusPyToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { TempusAmm } from './ethers';
export type { TempusPool } from './ethers';
export type { TempusPyToken } from './ethers';
