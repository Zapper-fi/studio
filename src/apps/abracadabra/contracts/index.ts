import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import {
  AbracadabraBentoBoxTokenContract__factory,
  AbracadabraCauldron__factory,
  AbracadabraConvexWrapper__factory,
  AbracadabraErc20Vault__factory,
  AbracadabraGlpWrapper__factory,
  AbracadabraGmxSGlp__factory,
  AbracadabraMagicApe__factory,
  AbracadabraMagicApeLens__factory,
  AbracadabraMagicGlpHarvestor__factory,
  AbracadabraMarketLens__factory,
  AbracadabraMspell__factory,
  AbracadabraStakedSpell__factory,
  GmxRewardTracker__factory,
  PopsicleChef__factory,
  SushiswapBentobox__factory,
} from './ethers';

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
  abracadabraErc20Vault({ address, network }: ContractOpts) {
    return AbracadabraErc20Vault__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  abracadabraGlpWrapper({ address, network }: ContractOpts) {
    return AbracadabraGlpWrapper__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  abracadabraGmxSGlp({ address, network }: ContractOpts) {
    return AbracadabraGmxSGlp__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  abracadabraMagicApe({ address, network }: ContractOpts) {
    return AbracadabraMagicApe__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  abracadabraMagicApeLens({ address, network }: ContractOpts) {
    return AbracadabraMagicApeLens__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  abracadabraMagicGlpHarvestor({ address, network }: ContractOpts) {
    return AbracadabraMagicGlpHarvestor__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  abracadabraMarketLens({ address, network }: ContractOpts) {
    return AbracadabraMarketLens__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  abracadabraMspell({ address, network }: ContractOpts) {
    return AbracadabraMspell__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  abracadabraStakedSpell({ address, network }: ContractOpts) {
    return AbracadabraStakedSpell__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  gmxRewardTracker({ address, network }: ContractOpts) {
    return GmxRewardTracker__factory.connect(address, this.appToolkit.getNetworkProvider(network));
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
export type { AbracadabraErc20Vault } from './ethers';
export type { AbracadabraGlpWrapper } from './ethers';
export type { AbracadabraGmxSGlp } from './ethers';
export type { AbracadabraMagicApe } from './ethers';
export type { AbracadabraMagicApeLens } from './ethers';
export type { AbracadabraMagicGlpHarvestor } from './ethers';
export type { AbracadabraMarketLens } from './ethers';
export type { AbracadabraMspell } from './ethers';
export type { AbracadabraStakedSpell } from './ethers';
export type { GmxRewardTracker } from './ethers';
export type { PopsicleChef } from './ethers';
export type { SushiswapBentobox } from './ethers';
