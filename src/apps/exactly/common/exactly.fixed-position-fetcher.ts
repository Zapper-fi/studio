import { Inject } from '@nestjs/common';
import type { BigNumber } from 'ethers';

import { APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import type { IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import type { GetDataPropsParams, GetTokenPropsParams } from '~position/template/app-token.template.types';

import { ExactlyContractFactory } from '../contracts';
import type { Market } from '../contracts';
import { EXACTLY_DEFINITION } from '../exactly.definition';

import { ExactlyDefinitionsResolver } from './exactly.definitions-resolver';
import type { ExactlyMarketDefinition } from './exactly.definitions-resolver';
import { ExactlyTokenFetcher } from './exactly.token-fetcher';
import type { ExactlyMarketProps } from './exactly.token-fetcher';

export type ExactlyFixedMarketProps = ExactlyMarketProps & { maturity: number };

export abstract class ExactlyFixedPositionFetcher<
  V extends ExactlyMarketProps = ExactlyMarketProps,
> extends ExactlyTokenFetcher<V> {
  appId = EXACTLY_DEFINITION.id;
  isDebt = false;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ExactlyContractFactory) protected readonly contractFactory: ExactlyContractFactory,
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
    return Number(this.getBestRate(params).rate) / 1e18;
  }

  getApy(params: GetDataPropsParams<Market, ExactlyMarketProps, ExactlyMarketDefinition>) {
    const { maturity, rate } = this.getBestRate(params);
    const timeLeft = maturity.toNumber() - Math.round(Date.now() / 1_000);
    return Promise.resolve((1 + ((Number(rate) / 1e18) * timeLeft) / 31_536_000) ** (31_536_000 / timeLeft) - 1);
  }
}
