import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { MakerCdpManager__factory } from './ethers';
import { MakerGemJoin__factory } from './ethers';
import { MakerGovernance__factory } from './ethers';
import { MakerIlkRegistry__factory } from './ethers';
import { MakerProxyRegistry__factory } from './ethers';
import { MakerVat__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class MakerContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  makerCdpManager({ address, network }: ContractOpts) {
    return MakerCdpManager__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  makerGemJoin({ address, network }: ContractOpts) {
    return MakerGemJoin__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  makerGovernance({ address, network }: ContractOpts) {
    return MakerGovernance__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  makerIlkRegistry({ address, network }: ContractOpts) {
    return MakerIlkRegistry__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  makerProxyRegistry({ address, network }: ContractOpts) {
    return MakerProxyRegistry__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  makerVat({ address, network }: ContractOpts) {
    return MakerVat__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { MakerCdpManager } from './ethers';
export type { MakerGemJoin } from './ethers';
export type { MakerGovernance } from './ethers';
export type { MakerIlkRegistry } from './ethers';
export type { MakerProxyRegistry } from './ethers';
export type { MakerVat } from './ethers';
