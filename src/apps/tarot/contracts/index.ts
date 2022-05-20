import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { CompoundCToken__factory } from './ethers';
import { CompoundComptroller__factory } from './ethers';
import { TarotBorrowable__factory } from './ethers';
import { TarotFactory__factory } from './ethers';
import { TarotSupplyVault__factory } from './ethers';
import { TarotVault__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class TarotContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  compoundCToken({ address, network }: ContractOpts) {
    return CompoundCToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  compoundComptroller({ address, network }: ContractOpts) {
    return CompoundComptroller__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  tarotBorrowable({ address, network }: ContractOpts) {
    return TarotBorrowable__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  tarotFactory({ address, network }: ContractOpts) {
    return TarotFactory__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  tarotSupplyVault({ address, network }: ContractOpts) {
    return TarotSupplyVault__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  tarotVault({ address, network }: ContractOpts) {
    return TarotVault__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { CompoundCToken } from './ethers';
export type { CompoundComptroller } from './ethers';
export type { TarotBorrowable } from './ethers';
export type { TarotFactory } from './ethers';
export type { TarotSupplyVault } from './ethers';
export type { TarotVault } from './ethers';
