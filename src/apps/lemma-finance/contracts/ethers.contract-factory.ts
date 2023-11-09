import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import {
  LemmaPerp__factory,
  LemmaSynth__factory,
  LemmaUsdl__factory,
  LemmaXSynth__factory,
  LemmaXUsdl__factory,
} from './ethers';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class LemmaFinanceContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  lemmaPerp({ address, network }: ContractOpts) {
    return LemmaPerp__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  lemmaSynth({ address, network }: ContractOpts) {
    return LemmaSynth__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  lemmaUsdl({ address, network }: ContractOpts) {
    return LemmaUsdl__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  lemmaXSynth({ address, network }: ContractOpts) {
    return LemmaXSynth__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  lemmaXUsdl({ address, network }: ContractOpts) {
    return LemmaXUsdl__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { LemmaPerp } from './ethers';
export type { LemmaSynth } from './ethers';
export type { LemmaUsdl } from './ethers';
export type { LemmaXSynth } from './ethers';
export type { LemmaXUsdl } from './ethers';
