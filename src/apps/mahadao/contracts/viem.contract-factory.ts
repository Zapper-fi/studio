import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { MahadoMahaxLocker__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class MahadaoViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  mahadoMahaxLocker({ address, network }: ContractOpts) {
    return MahadoMahaxLocker__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
