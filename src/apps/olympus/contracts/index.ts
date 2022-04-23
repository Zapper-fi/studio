import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { OlympusGOhmToken__factory } from './ethers';
import { OlympusSOhmToken__factory } from './ethers';
import { OlympusSOhmV1Token__factory } from './ethers';
import { OlympusV2BondDepository__factory } from './ethers';
import { OlympusWsOhmV1Token__factory } from './ethers';
import { OlympusZapperZap__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class OlympusContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  olympusGOhmToken({ address, network }: ContractOpts) {
    return OlympusGOhmToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  olympusSOhmToken({ address, network }: ContractOpts) {
    return OlympusSOhmToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  olympusSOhmV1Token({ address, network }: ContractOpts) {
    return OlympusSOhmV1Token__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  olympusV2BondDepository({ address, network }: ContractOpts) {
    return OlympusV2BondDepository__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  olympusWsOhmV1Token({ address, network }: ContractOpts) {
    return OlympusWsOhmV1Token__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  olympusZapperZap({ address, network }: ContractOpts) {
    return OlympusZapperZap__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { OlympusGOhmToken } from './ethers';
export type { OlympusSOhmToken } from './ethers';
export type { OlympusSOhmV1Token } from './ethers';
export type { OlympusV2BondDepository } from './ethers';
export type { OlympusWsOhmV1Token } from './ethers';
export type { OlympusZapperZap } from './ethers';
