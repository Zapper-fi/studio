import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { fromPairs } from 'lodash';

import { ContractType } from '~position/contract.interface';
import { PositionBalanceFetcherRegistry } from '~position/position-balance-fetcher.registry';
import { PositionFetcherRegistry } from '~position/position-fetcher.registry';
import { PositionFetcherTemplateRegistry } from '~position/position-fetcher.template-registry';

import { TokenBalanceResponse } from './balance-fetcher.interface';
import { BalanceFetcherRegistry } from './balance-fetcher.registry';
import { BalancePresentationService } from './balance-presentation.service';
import { DefaultContractPositionBalanceFetcherFactory } from './default.contract-position-balance-fetcher.factory';
import { DefaultTokenBalanceFetcherFactory } from './default.token-balance-fetcher.factory';
import { GetBalancesParams } from './dto/get-balances-params.dto';
import { GetBalancesQuery } from './dto/get-balances-query.dto';

@Injectable()
export class BalanceService {
  private logger = new Logger(BalanceService.name);

  constructor(
    @Inject(BalanceFetcherRegistry) private readonly balanceFetcherRegistry: BalanceFetcherRegistry,
    @Inject(PositionFetcherRegistry) private readonly positionFetcherRegistry: PositionFetcherRegistry,
    @Inject(PositionBalanceFetcherRegistry)
    private readonly positionFetcherBalanceFetcherRegistry: PositionBalanceFetcherRegistry,
    @Inject(DefaultBalancePresenterFactory)
    private readonly defaultTokenBalanceFetcherFactory: DefaultTokenBalanceFetcherFactory,
    @Inject(PositionFetcherTemplateRegistry)
    private readonly positionFetcherTemplateRegistry: PositionFetcherTemplateRegistry,
    @Inject(DefaultContractPositionBalanceFetcherFactory)
    private readonly defaultContractPositionBalanceFetcherFactory: DefaultContractPositionBalanceFetcherFactory,

    @Inject(BalancePresentationService)
    private readonly balancePresentationService: BalancePresentationService,
  ) {}

  private async getBalancesLegacyStrategy({ appId, addresses, network }: GetBalancesQuery & GetBalancesParams) {
    const fetcher = this.balanceFetcherRegistry.get(appId, network)!;

    const addressBalancePairs = await Promise.all(
      addresses.map(async address => {
        const balances = await fetcher.getBalances(address).catch(e => {
          this.logger.error(`Failed to fetch balance for ${appId} on network ${network}: ${e.stack}`);
          return { error: e.message } as TokenBalanceResponse;
        });

        return [address, balances];
      }),
    );

    return fromPairs(addressBalancePairs);
  }

  private async getBalancesTemplateStrategy({ appId, addresses, network }: GetBalancesQuery & GetBalancesParams) {
    // If there is no custom fetcher defined, and there are no token/contract position groups defined, declare 404
    const templates = this.positionFetcherTemplateRegistry.getTemplatesForAppOnNetwork(appId, network);
    if (!templates.length) throw new NotFoundException(`Protocol ${appId} is not supported on network ${network}`);

    const balanceEnabledTemplates = templates.filter(template => !template.isExcludedFromBalances);

    const addressBalancePairs = await Promise.all(
      addresses.map(async address => {
        const balances = await Promise.all(balanceEnabledTemplates.map(template => template.getBalances(address)));
        const presentedBalances = await this.balancePresentationService.presentTemplates({
          appId,
          network,
          address,
          balances: balances.flat(),
        });
        return [address, presentedBalances];
      }),
    );

    return fromPairs(addressBalancePairs);
  }

  private async getBalancesGeneralizedStrategy({ appId, addresses, network }: GetBalancesQuery & GetBalancesParams) {
    const tokenGroupIds = this.positionFetcherRegistry.getGroupIdsForApp({
      type: ContractType.APP_TOKEN,
      network,
      appId,
    });

    const positionGroupIds = this.positionFetcherRegistry.getGroupIdsForApp({
      type: ContractType.POSITION,
      network,
      appId,
    });

    // If there is no custom fetcher defined, and there are no token/contract position groups defined, declare 404
    if (!tokenGroupIds.length && !positionGroupIds.length)
      throw new NotFoundException(`Protocol ${appId} is not supported on network ${network}`);

    const addressBalancePairs = await Promise.all(
      addresses.map(async address => {
        const [tokenBalances, contractPositionBalances] = await Promise.all([
          await Promise.all(
            tokenGroupIds.map(async groupId => {
              const fetcherSelector = { type: ContractType.APP_TOKEN, appId, groupId, network };

              const balanceFetcher = this.positionFetcherBalanceFetcherRegistry.get(fetcherSelector);
              if (balanceFetcher) return balanceFetcher.getBalances(address);

              const defaultBalanceFetcher = this.defaultTokenBalanceFetcherFactory.build(fetcherSelector);
              return defaultBalanceFetcher.getBalances(address);
            }),
          ),
          await Promise.all(
            positionGroupIds.map(async groupId => {
              const fetcherSelector = { type: ContractType.POSITION, appId, groupId, network };

              const balanceFetcher = this.positionFetcherBalanceFetcherRegistry.get(fetcherSelector);
              if (balanceFetcher) return balanceFetcher.getBalances(address);

              const defaultBalanceFetcher = this.defaultContractPositionBalanceFetcherFactory.build(fetcherSelector);
              return defaultBalanceFetcher.getBalances(address);
            }),
          ),
        ]);

        const preprocessed = [...tokenBalances.flat(), ...contractPositionBalances.flat()];
        const presentedBalances = await this.balancePresentationService.present({
          appId,
          network,
          address,
          balances: preprocessed,
        });
        return [address, presentedBalances];
      }),
    );

    return fromPairs(addressBalancePairs);
  }

  async getBalances({ appId, addresses, network }: GetBalancesQuery & GetBalancesParams) {
    // @TODO there is no 404 thrown anymore if there is no balance fetcher... add appId validation at least
    if (this.positionFetcherTemplateRegistry.getAppHasTemplatesOnNetwork(appId, network)) {
      return this.getBalancesTemplateStrategy({ appId, network, addresses });
    }
    if (this.balanceFetcherRegistry.get(appId, network)) {
      return this.getBalancesLegacyStrategy({ appId, addresses, network });
    }
    return this.getBalancesGeneralizedStrategy({ appId, addresses, network });
  }
}
