import { Injectable, Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import {
  PolynomialAccountResolver__factory,
  PolynomialCoveredCall__factory,
  PolynomialPerp__factory,
  PolynomialPutSelling__factory,
  PolynomialResolver__factory,
  PolynomialSmartWalletIndex__factory,
  PolynomialVaultToken__factory,
} from './viem';

type ContractOpts = { address: string; network: Network };

@Injectable()
export class PolynomialViemContractFactory {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  polynomialAccountResolver({ address, network }: ContractOpts) {
    return PolynomialAccountResolver__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  polynomialCoveredCall({ address, network }: ContractOpts) {
    return PolynomialCoveredCall__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  polynomialPerp({ address, network }: ContractOpts) {
    return PolynomialPerp__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  polynomialPutSelling({ address, network }: ContractOpts) {
    return PolynomialPutSelling__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  polynomialResolver({ address, network }: ContractOpts) {
    return PolynomialResolver__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  polynomialSmartWalletIndex({ address, network }: ContractOpts) {
    return PolynomialSmartWalletIndex__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
  polynomialVaultToken({ address, network }: ContractOpts) {
    return PolynomialVaultToken__factory.connect(address, this.appToolkit.getViemNetworkProvider(network));
  }
}
