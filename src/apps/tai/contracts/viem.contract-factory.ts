import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { TaiCollateralJoin__factory, TaiSafeJoin__factory, TaiSafeManager__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class TaiViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  taiCollateralJoin({ address, network }: ContractOpts) {
    return TaiCollateralJoin__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  taiSafeJoin({ address, network }: ContractOpts) {
    return TaiSafeJoin__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  taiSafeManager({ address, network }: ContractOpts) {
    return TaiSafeManager__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
