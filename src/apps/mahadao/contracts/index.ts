import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { MahadoMahaxLocker__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class MahadaoContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  mahadoMahaxLocker({ address, network }: ContractOpts) {
    return MahadoMahaxLocker__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { MahadoMahaxLocker } from './ethers';
