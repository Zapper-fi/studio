import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  MakerCdpManager__factory,
  MakerGemJoin__factory,
  MakerGovernance__factory,
  MakerIlkRegistry__factory,
  MakerMdcPot__factory,
  MakerProxyRegistry__factory,
  MakerVat__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class MakerViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  makerCdpManager({ address, network }: ContractOpts) {
    return MakerCdpManager__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  makerGemJoin({ address, network }: ContractOpts) {
    return MakerGemJoin__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  makerGovernance({ address, network }: ContractOpts) {
    return MakerGovernance__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  makerIlkRegistry({ address, network }: ContractOpts) {
    return MakerIlkRegistry__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  makerMdcPot({ address, network }: ContractOpts) {
    return MakerMdcPot__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  makerProxyRegistry({ address, network }: ContractOpts) {
    return MakerProxyRegistry__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  makerVat({ address, network }: ContractOpts) {
    return MakerVat__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
