import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { IronBankCToken__factory, IronBankComptroller__factory, IronBankLens__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class IronBankViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  ironBankCToken({ address, network }: ContractOpts) {
    return IronBankCToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  ironBankComptroller({ address, network }: ContractOpts) {
    return IronBankComptroller__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  ironBankLens({ address, network }: ContractOpts) {
    return IronBankLens__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
