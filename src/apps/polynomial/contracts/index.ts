import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ContractFactory } from '~contract/contracts';
import { Network } from '~types/network.interface';

import { PolynomialCoveredCall__factory } from './ethers';
import { PolynomialPutSelling__factory } from './ethers';
import { PolynomialResolver__factory } from './ethers';
import { PolynomialVaultToken__factory } from './ethers';

// eslint-disable-next-line
type ContractOpts = { address: string; network: Network };

@Injectable()
export class PolynomialContractFactory extends ContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super((network: Network) => appToolkit.getNetworkProvider(network));
  }

  polynomialCoveredCall({ address, network }: ContractOpts) {
    return PolynomialCoveredCall__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  polynomialPutSelling({ address, network }: ContractOpts) {
    return PolynomialPutSelling__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  polynomialResolver({ address, network }: ContractOpts) {
    return PolynomialResolver__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
  polynomialVaultToken({ address, network }: ContractOpts) {
    return PolynomialVaultToken__factory.connect(address, this.appToolkit.getNetworkProvider(network));
  }
}

export type { PolynomialCoveredCall } from './ethers';
export type { PolynomialPutSelling } from './ethers';
export type { PolynomialResolver } from './ethers';
export type { PolynomialVaultToken } from './ethers';
