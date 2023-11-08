import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  LemmaPerp__factory,
  LemmaSynth__factory,
  LemmaUsdl__factory,
  LemmaXSynth__factory,
  LemmaXUsdl__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class LemmaFinanceViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  lemmaPerp({ address, network }: ContractOpts) {
    return LemmaPerp__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  lemmaSynth({ address, network }: ContractOpts) {
    return LemmaSynth__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  lemmaUsdl({ address, network }: ContractOpts) {
    return LemmaUsdl__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  lemmaXSynth({ address, network }: ContractOpts) {
    return LemmaXSynth__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  lemmaXUsdl({ address, network }: ContractOpts) {
    return LemmaXUsdl__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
