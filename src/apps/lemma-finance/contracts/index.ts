import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { PerpLemma__factory } from './ethers';
import { StakedUsdl__factory } from './ethers';
import { Synth__factory } from './ethers';
import { Usdl__factory } from './ethers';
import { XSynth__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class LemmaFinanceContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  perpLemma({ address, network }: ContractOpts) {
    return PerpLemma__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  stakedUsdl({ address, network }: ContractOpts) {
    return StakedUsdl__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  synth({ address, network }: ContractOpts) {
    return Synth__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  usdl({ address, network }: ContractOpts) {
    return Usdl__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  xSynth({ address, network }: ContractOpts) {
    return XSynth__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { PerpLemma } from './ethers';
export type { StakedUsdl } from './ethers';
export type { Synth } from './ethers';
export type { Usdl } from './ethers';
export type { XSynth } from './ethers';
