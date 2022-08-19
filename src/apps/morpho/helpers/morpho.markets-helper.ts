import { Inject, Injectable } from '@nestjs/common';
import { compact } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { MorphoContractFactory } from '~apps/morpho';
import { MorphoCompoundLens } from '~apps/morpho/contracts';
import { MorphoRateHelper } from '~apps/morpho/helpers/morpho.rate-helper';
import { TokenDependency } from '~position/selectors/token-dependency-selector.interface';

@Injectable()
export class MorphoMarketsHelper {
  underlyings: { [market: string]: TokenDependency & { p2pDisabled: boolean } } = {};
  markets: string[] = [];
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(MorphoContractFactory) private readonly morphoContractFactory: MorphoContractFactory,
    @Inject(MorphoRateHelper) private readonly rateHelper: MorphoRateHelper,
  ) {}

  async setupMarkets(lens: MorphoCompoundLens, network, appId) {
    if (this.markets.length > 0 && Object.keys(this.underlyings).length > 0) return;
    const tokenSelector = this.appToolkit.getTokenDependencySelector({ tags: { network, context: appId } });

    this.markets = await lens.getAllMarkets().then(r => r.map(market => market.toLowerCase()));

    this.underlyings = Object.fromEntries(
      await Promise.all(
        this.markets.map(async market => {
          const { underlying, p2pDisabled } = await lens.getMarketConfiguration(market);
          const dependencies = await tokenSelector.getOne({
            network,
            address: underlying.toLowerCase(),
          });
          if (!dependencies) return null;
          return [market, { ...dependencies, p2pDisabled }];
        }),
      ).then(deps => compact(deps)),
    );
  }
}
