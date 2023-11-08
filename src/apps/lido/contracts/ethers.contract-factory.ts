import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { LidoSteth__factory, LidoStethEthOracle__factory, LidoStksm__factory, LidoWsteth__factory } from './ethers';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class LidoContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  lidoSteth({ address, network }: ContractOpts) {
    return LidoSteth__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  lidoStethEthOracle({ address, network }: ContractOpts) {
    return LidoStethEthOracle__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  lidoStksm({ address, network }: ContractOpts) {
    return LidoStksm__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  lidoWsteth({ address, network }: ContractOpts) {
    return LidoWsteth__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { LidoSteth } from './ethers';
export type { LidoStethEthOracle } from './ethers';
export type { LidoStksm } from './ethers';
export type { LidoWsteth } from './ethers';
