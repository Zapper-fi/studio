import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  CompoundCToken__factory,
  CompoundComptroller__factory,
  TarotBorrowable__factory,
  TarotFactory__factory,
  TarotSupplyVault__factory,
  TarotVault__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class TarotViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  compoundCToken({ address, network }: ContractOpts) {
    return CompoundCToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  compoundComptroller({ address, network }: ContractOpts) {
    return CompoundComptroller__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  tarotBorrowable({ address, network }: ContractOpts) {
    return TarotBorrowable__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  tarotFactory({ address, network }: ContractOpts) {
    return TarotFactory__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  tarotSupplyVault({ address, network }: ContractOpts) {
    return TarotSupplyVault__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  tarotVault({ address, network }: ContractOpts) {
    return TarotVault__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
