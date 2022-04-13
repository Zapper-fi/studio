import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { AelinPool__factory } from './ethers';
import { AelinStaking__factory } from './ethers';
import { AelinVAelin__factory } from './ethers';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class AelinContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  aelinPool({ address, network }: ContractOpts) {
    return AelinPool__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  aelinStaking({ address, network }: ContractOpts) {
    return AelinStaking__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  aelinVAelin({ address, network }: ContractOpts) {
    return AelinVAelin__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { AelinPool } from './ethers';
export type { AelinStaking } from './ethers';
export type { AelinVAelin } from './ethers';
