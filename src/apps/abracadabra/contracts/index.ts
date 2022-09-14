import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { AbracadabraBentoBoxTokenContract__factory } from './ethers';
import { AbracadabraCauldron__factory } from './ethers';
import { AbracadabraConvexWrapper__factory } from './ethers';
import { AbracadabraMspell__factory } from './ethers';
import { AbracadabraStakedSpell__factory } from './ethers';
import { PopsicleChef__factory } from './ethers';
import { SushiswapBentobox__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class AbracadabraContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  abracadabraBentoBoxTokenContract({ address, network }: ContractOpts) {
    return AbracadabraBentoBoxTokenContract__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  abracadabraCauldron({ address, network }: ContractOpts) {
    return AbracadabraCauldron__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  abracadabraConvexWrapper({ address, network }: ContractOpts) {
    return AbracadabraConvexWrapper__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  abracadabraMspell({ address, network }: ContractOpts) {
    return AbracadabraMspell__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  abracadabraStakedSpell({ address, network }: ContractOpts) {
    return AbracadabraStakedSpell__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  popsicleChef({ address, network }: ContractOpts) {
    return PopsicleChef__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  sushiswapBentobox({ address, network }: ContractOpts) {
    return SushiswapBentobox__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { AbracadabraBentoBoxTokenContract } from './ethers';
export type { AbracadabraCauldron } from './ethers';
export type { AbracadabraConvexWrapper } from './ethers';
export type { AbracadabraMspell } from './ethers';
export type { AbracadabraStakedSpell } from './ethers';
export type { PopsicleChef } from './ethers';
export type { SushiswapBentobox } from './ethers';
