import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  BProtocolBamm__factory,
  BProtocolBammLens__factory,
  BProtocolCompoundComptroller__factory,
  BProtocolCompoundRegistry__factory,
  BProtocolCompoundToken__factory,
  BProtocolGetInfo__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class BProtocolViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  bProtocolBamm({ address, network }: ContractOpts) {
    return BProtocolBamm__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  bProtocolBammLens({ address, network }: ContractOpts) {
    return BProtocolBammLens__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  bProtocolCompoundComptroller({ address, network }: ContractOpts) {
    return BProtocolCompoundComptroller__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  bProtocolCompoundRegistry({ address, network }: ContractOpts) {
    return BProtocolCompoundRegistry__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  bProtocolCompoundToken({ address, network }: ContractOpts) {
    return BProtocolCompoundToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  bProtocolGetInfo({ address, network }: ContractOpts) {
    return BProtocolGetInfo__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
