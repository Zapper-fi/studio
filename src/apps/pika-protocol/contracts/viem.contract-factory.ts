import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { PikaProtocolVault__factory, PikaProtocolVaultReward__factory, PikaProtocolVester__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class PikaProtocolViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  pikaProtocolVault({ address, network }: ContractOpts) {
    return PikaProtocolVault__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  pikaProtocolVaultReward({ address, network }: ContractOpts) {
    return PikaProtocolVaultReward__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  pikaProtocolVester({ address, network }: ContractOpts) {
    return PikaProtocolVester__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
