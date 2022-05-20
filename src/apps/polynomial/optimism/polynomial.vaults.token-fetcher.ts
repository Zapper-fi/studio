import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { PolynomialContractFactory } from '../contracts';
import { POLYNOMIAL_DEFINITION } from '../polynomial.definition';

const appId = POLYNOMIAL_DEFINITION.id;
const groupId = POLYNOMIAL_DEFINITION.groups.vaults.id;
const network = Network.OPTIMISM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class OptimismPolynomialVaultsTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PolynomialContractFactory) private readonly polynomialContractFactory: PolynomialContractFactory,
  ) { }

  async getPositions() {
    return [];
  }
}
