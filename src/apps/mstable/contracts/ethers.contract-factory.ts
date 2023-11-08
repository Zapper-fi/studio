import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import {
  MstableAsset__factory,
  MstableMetavault4626__factory,
  MstableStaking__factory,
  MstableStakingV2__factory,
  MstableVmta__factory,
} from './ethers';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class MstableContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  mstableAsset({ address, network }: ContractOpts) {
    return MstableAsset__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  mstableMetavault4626({ address, network }: ContractOpts) {
    return MstableMetavault4626__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  mstableStaking({ address, network }: ContractOpts) {
    return MstableStaking__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  mstableStakingV2({ address, network }: ContractOpts) {
    return MstableStakingV2__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  mstableVmta({ address, network }: ContractOpts) {
    return MstableVmta__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { MstableAsset } from './ethers';
export type { MstableMetavault4626 } from './ethers';
export type { MstableStaking } from './ethers';
export type { MstableStakingV2 } from './ethers';
export type { MstableVmta } from './ethers';
