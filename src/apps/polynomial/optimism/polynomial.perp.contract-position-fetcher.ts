import { Inject } from '@nestjs/common';
import Axios from 'axios';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { SynthetixContractFactory } from '../../synthetix/contracts';
import { OptimismSynthetixPerpV2ContractPositionFetcher } from '../../synthetix/optimism/synthetix.perp-v2.contract-position-fetcher';
import { PolynomialContractFactory } from '../contracts';
import { PolynomialAccountResolver } from '../common/polynomial.account-resolver';

export type PolynomialPerpDataProp = {
  liquidity: number;
};

@PositionTemplate()
export class OptimismPolynomialPerpContractPositionFetcher extends OptimismSynthetixPerpV2ContractPositionFetcher {
  groupLabel = 'Perp';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SynthetixContractFactory) protected readonly synthetixContractFactory: SynthetixContractFactory,
    @Inject(PolynomialContractFactory) protected readonly polynomialContractFactory: PolynomialContractFactory,
    @Inject(PolynomialAccountResolver) protected readonly polynomialAccountResolver: PolynomialAccountResolver,
  ) {
    super(appToolkit, synthetixContractFactory);
  }

  async getAccountAddress(address: string): Promise<string> {
    return this.polynomialAccountResolver.getSmartWalletAddress(address);
  }

  async getDataProps(): Promise<PolynomialPerpDataProp> {
    const { data } = await Axios.get<{ tvl: number }>('https://perps-api-experimental.polynomial.fi/snx-perps/tvl');
    return {
      liquidity: data.tvl
    };
  }
}
