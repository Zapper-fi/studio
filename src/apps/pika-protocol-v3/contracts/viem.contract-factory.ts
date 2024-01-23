import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { PikaProtocolV3Rewards__factory, PikaProtocolV3Vault__factory } from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class PikaProtocolV3ViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  pikaProtocolV3Rewards({ address, network }: ContractOpts) {
    return PikaProtocolV3Rewards__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  pikaProtocolV3Vault({ address, network }: ContractOpts) {
    return PikaProtocolV3Vault__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
