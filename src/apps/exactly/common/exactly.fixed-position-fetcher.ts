import { Inject } from '@nestjs/common';
import type { BigNumber } from 'ethers';

import { APP_TOOLKIT, type IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import type { GetDataPropsParams, GetTokenPropsParams } from '~position/template/app-token.template.types';

import { ExactlyViemContractFactory } from '../contracts';
import { Market } from '../contracts/viem';

import { ExactlyDefinitionsResolver, type ExactlyMarketDefinition } from './exactly.definitions-resolver';
import { type ExactlyMarketProps, ExactlyTokenFetcher } from './exactly.token-fetcher';

export type ExactlyFixedMarketProps = ExactlyMarketProps & { maturity: number };

export abstract class ExactlyFixedPositionFetcher<
  V extends ExactlyMarketProps = ExactlyMarketProps,
> extends ExactlyTokenFetcher<V> {
  isDebt = false;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ExactlyViemContractFactory) protected readonly contractFactory: ExactlyViemContractFactory,
    @Inject(ExactlyDefinitionsResolver) protected readonly definitionsResolver: ExactlyDefinitionsResolver,
  ) {
    super(appToolkit, contractFactory, definitionsResolver);
  }

  getSupply(params: GetTokenPropsParams<Market, ExactlyMarketProps, ExactlyMarketDefinition>) {
    return Promise.resolve(this.getTotalAssets(params));
  }

  abstract getBestRate(_: GetDataPropsParams<Market, ExactlyMarketProps, ExactlyMarketDefinition>): {
    maturity: BigNumber;
    rate: BigNumber;
  };

  getApr(params: GetDataPropsParams<Market, ExactlyMarketProps, ExactlyMarketDefinition>) {
    return Number(this.getBestRate(params).rate) / 1e16;
  }

  getApy(params: GetDataPropsParams<Market, ExactlyMarketProps, ExactlyMarketDefinition>) {
    const { maturity, rate } = this.getBestRate(params);
    const timeLeft = Number(maturity) - Math.round(Date.now() / 1_000);
    return Promise.resolve(
      ((1 + ((Number(rate) / 1e18) * timeLeft) / 31_536_000) ** (31_536_000 / timeLeft) - 1) * 100,
    );
  }
}
