import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { IronBankCToken__factory } from './ethers';
import { IronBankComptroller__factory } from './ethers';
import { IronBankLens__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class IronBankContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  ironBankCToken({ address, network }: ContractOpts) {
    return IronBankCToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  ironBankComptroller({ address, network }: ContractOpts) {
    return IronBankComptroller__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  ironBankLens({ address, network }: ContractOpts) {
    return IronBankLens__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { IronBankCToken } from './ethers';
export type { IronBankComptroller } from './ethers';
export type { IronBankLens } from './ethers';
