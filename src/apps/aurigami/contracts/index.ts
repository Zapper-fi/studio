import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { AurigamiAuToken__factory } from './ethers';
import { AurigamiComptroller__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class AurigamiContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  aurigamiAuToken({ address, network }: ContractOpts) {
    return AurigamiAuToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  aurigamiComptroller({ address, network }: ContractOpts) {
    return AurigamiComptroller__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { AurigamiAuToken } from './ethers';
export type { AurigamiComptroller } from './ethers';
