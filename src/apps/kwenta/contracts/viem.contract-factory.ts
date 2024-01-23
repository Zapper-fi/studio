import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  KwentaAccountResolver__factory,
  KwentaEscrow__factory,
  KwentaPerp__factory,
  KwentaStaking__factory,
  KwentaStakingV2__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class KwentaViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  kwentaAccountResolver({ address, network }: ContractOpts) {
    return KwentaAccountResolver__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  kwentaEscrow({ address, network }: ContractOpts) {
    return KwentaEscrow__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  kwentaPerp({ address, network }: ContractOpts) {
    return KwentaPerp__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  kwentaStaking({ address, network }: ContractOpts) {
    return KwentaStaking__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  kwentaStakingV2({ address, network }: ContractOpts) {
    return KwentaStakingV2__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
