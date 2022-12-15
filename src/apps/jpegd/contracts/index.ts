import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { JpegdBondDepository__factory } from './ethers';
import { JpegdLpFarm__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class JpegdContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  jpegdBondDepository({ address, network }: ContractOpts) {
    return JpegdBondDepository__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  jpegdLpFarm({ address, network }: ContractOpts) {
    return JpegdLpFarm__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { JpegdBondDepository } from './ethers';
export type { JpegdLpFarm } from './ethers';
