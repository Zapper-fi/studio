import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { JpegdBondDepository__factory, JpegdLpFarm__factory, JpegdLpFarmV2__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class JpegdViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  jpegdBondDepository({ address, network }: ContractOpts) {
    return JpegdBondDepository__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  jpegdLpFarm({ address, network }: ContractOpts) {
    return JpegdLpFarm__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  jpegdLpFarmV2({ address, network }: ContractOpts) {
    return JpegdLpFarmV2__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
