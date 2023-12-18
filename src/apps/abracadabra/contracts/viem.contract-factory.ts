import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  AbracadabraBentoBoxTokenContract__factory,
  AbracadabraCauldron__factory,
  AbracadabraConvexWrapper__factory,
  AbracadabraErc20Vault__factory,
  AbracadabraFarmBoosted__factory,
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
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class AbracadabraViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  abracadabraBentoBoxTokenContract({ address, network }: ContractOpts) {
    return AbracadabraBentoBoxTokenContract__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  abracadabraCauldron({ address, network }: ContractOpts) {
    return AbracadabraCauldron__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  abracadabraConvexWrapper({ address, network }: ContractOpts) {
    return AbracadabraConvexWrapper__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  abracadabraErc20Vault({ address, network }: ContractOpts) {
    return AbracadabraErc20Vault__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  abracadabraFarmBoosted({ address, network }: ContractOpts) {
    return AbracadabraFarmBoosted__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  abracadabraGlpWrapper({ address, network }: ContractOpts) {
    return AbracadabraGlpWrapper__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  abracadabraGmxSGlp({ address, network }: ContractOpts) {
    return AbracadabraGmxSGlp__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  abracadabraMagicApe({ address, network }: ContractOpts) {
    return AbracadabraMagicApe__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  abracadabraMagicApeLens({ address, network }: ContractOpts) {
    return AbracadabraMagicApeLens__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  abracadabraMagicGlpHarvestor({ address, network }: ContractOpts) {
    return AbracadabraMagicGlpHarvestor__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  abracadabraMarketLens({ address, network }: ContractOpts) {
    return AbracadabraMarketLens__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  abracadabraMspell({ address, network }: ContractOpts) {
    return AbracadabraMspell__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  abracadabraStakedSpell({ address, network }: ContractOpts) {
    return AbracadabraStakedSpell__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  gmxRewardTracker({ address, network }: ContractOpts) {
    return GmxRewardTracker__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  popsicleChef({ address, network }: ContractOpts) {
    return PopsicleChef__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  sushiswapBentobox({ address, network }: ContractOpts) {
    return SushiswapBentobox__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
