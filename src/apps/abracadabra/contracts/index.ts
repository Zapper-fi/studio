import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { AbracadabraBentoBoxTokenContract__factory } from './ethers';
import { AbracadabraConvexWrapper__factory } from './ethers';
import { AbracadabraCouldronTokenContract__factory } from './ethers';
import { AbracadabraDegenbox__factory } from './ethers';
import { AbracadabraMspell__factory } from './ethers';
import { AbracadabraStakedSpellTokenContract__factory } from './ethers';
import { PopsicleChef__factory } from './ethers';

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
  abracadabraConvexWrapper({ address, network }: ContractOpts) {
    return AbracadabraConvexWrapper__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  abracadabraCouldronTokenContract({ address, network }: ContractOpts) {
    return AbracadabraCouldronTokenContract__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  abracadabraDegenbox({ address, network }: ContractOpts) {
    return AbracadabraDegenbox__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  abracadabraMspell({ address, network }: ContractOpts) {
    return AbracadabraMspell__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  abracadabraStakedSpellTokenContract({ address, network }: ContractOpts) {
    return AbracadabraStakedSpellTokenContract__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  popsicleChef({ address, network }: ContractOpts) {
    return PopsicleChef__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { AbracadabraBentoBoxTokenContract } from './ethers';
export type { AbracadabraConvexWrapper } from './ethers';
export type { AbracadabraCouldronTokenContract } from './ethers';
export type { AbracadabraDegenbox } from './ethers';
export type { AbracadabraMspell } from './ethers';
export type { AbracadabraStakedSpellTokenContract } from './ethers';
export type { PopsicleChef } from './ethers';
