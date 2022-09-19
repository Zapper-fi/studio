import { Inject } from '@nestjs/common';
import { flatMap } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  DefaultAppTokenDefinition,
  GetAddressesParams,
  GetDefinitionsParams,
  GetDisplayPropsParams,
} from '~position/template/app-token.template.types';
import { GetUnderlyingTokensParams, GetDataPropsParams } from '~position/template/app-token.template.types';

import { PoolTogetherV3ContractFactory, PoolTogetherV3Ticket } from '../contracts';

import { POOL_WITH_MULTIPLE_WINNERS_BUILDERS } from './pool-together-v3.community-tocket.pool-builders';
import { PoolTogetherV3LogProvider, PoolWithMultipleWinnersBuilderCreatedType } from './pool-together-v3.log-provider';

type PoolTogetherV3CommunityTicketDefinition = DefaultAppTokenDefinition & {
  type: PoolWithMultipleWinnersBuilderCreatedType;
  prizeStrategy: string;
  prizePool: string;
};

type PoolTogetherV3CommunityTicketDataProps = DefaultAppTokenDataProps & {
  liquidity: number;
  poolType: PoolWithMultipleWinnersBuilderCreatedType;
};

export abstract class PoolTogetherV3CommunityTicketTokenFetcher extends AppTokenTemplatePositionFetcher<
  PoolTogetherV3Ticket,
  PoolTogetherV3CommunityTicketDataProps,
  PoolTogetherV3CommunityTicketDefinition
> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PoolTogetherV3ContractFactory) private readonly contractFactory: PoolTogetherV3ContractFactory,
    @Inject(PoolTogetherV3LogProvider) private readonly logProvider: PoolTogetherV3LogProvider,
  ) {
    super(appToolkit);
  }

  extraDefinitions: PoolTogetherV3CommunityTicketDefinition[] = [];

  private BLOCKED_TICKET_ADDRESSES = [
    '0x41ee149372238fbce0f3c5e7076aa253d0fc4c70',
    '0x73216f8173959b6abb6e78e80bd251071787042c',
    '0x96e22522fc2da00c74227f77d976f9b878ee5a62',
  ];

  private getCommunityPoolBuilders() {
    const poolBuilders = POOL_WITH_MULTIPLE_WINNERS_BUILDERS[this.network];
    return poolBuilders ?? [];
  }

  getContract(address: string): PoolTogetherV3Ticket {
    return this.contractFactory.poolTogetherV3Ticket({ address, network: this.network });
  }

  async getAddresses({ definitions }: GetAddressesParams): Promise<string[]> {
    return definitions.map(({ address }) => address);
  }

  async getDefinitions({ multicall }: GetDefinitionsParams): Promise<PoolTogetherV3CommunityTicketDefinition[]> {
    const poolBuilders = this.getCommunityPoolBuilders();

    // Get all logs for each community pool builder contract
    const builderLogs = await Promise.all(
      poolBuilders.map(({ address, blockNumber }) =>
        this.logProvider.getPoolWithMultipleWinnersBuilderLogs({
          fromBlock: blockNumber,
          address,
          network: this.network,
        }),
      ),
    );

    // Build definitions
    const definitions = await Promise.all(
      builderLogs.flatMap(logs =>
        flatMap(logs, (logsForType, type: PoolWithMultipleWinnersBuilderCreatedType) =>
          logsForType.map(async log => {
            const prizePool = log.args[0].toLowerCase();
            const prizeStrategy = log.args[1].toLowerCase();
            const contract = multicall.wrap(
              this.contractFactory.poolTogetherV3MultipleWinners({
                network: this.network,
                address: prizeStrategy,
              }),
            );

            const ticketAddress = await contract.ticket().then(addr => addr.toLowerCase());

            return {
              type,
              address: ticketAddress,
              prizePool,
              prizeStrategy,
            };
          }),
        ),
      ),
    );

    const allDefinitions = [...definitions, ...this.extraDefinitions];
    return allDefinitions.filter(def => !this.BLOCKED_TICKET_ADDRESSES.includes(def.address));
  }

  async getLabel({
    appToken,
  }: GetDisplayPropsParams<
    PoolTogetherV3Ticket,
    PoolTogetherV3CommunityTicketDataProps,
    PoolTogetherV3CommunityTicketDefinition
  >) {
    if (appToken.dataProps.poolType === PoolWithMultipleWinnersBuilderCreatedType.COMPOUND)
      return `${appToken.symbol} (Compound)`;
    if (appToken.dataProps.poolType === PoolWithMultipleWinnersBuilderCreatedType.STAKE)
      return `${appToken.symbol} (Stake)`;
    if (appToken.dataProps.poolType === PoolWithMultipleWinnersBuilderCreatedType.YIELD)
      return `${appToken.symbol} (Yield)`;
    return appToken.symbol;
  }

  async getUnderlyingTokenAddresses({
    definition,
    multicall,
  }: GetUnderlyingTokensParams<PoolTogetherV3Ticket, PoolTogetherV3CommunityTicketDefinition>): Promise<
    string | string[]
  > {
    const contract = multicall.wrap(
      this.contractFactory.poolTogetherV3CommunityPrizePool({ network: this.network, address: definition.prizePool }),
    );
    const underlyingTokenAddress = await contract.token().then(addr => addr.toLowerCase());
    return [underlyingTokenAddress];
  }

  getLiquidity({ appToken }: GetDataPropsParams<PoolTogetherV3Ticket>) {
    return appToken.supply * appToken.price;
  }

  getReserves({ appToken }: GetDataPropsParams<PoolTogetherV3Ticket>) {
    return [appToken.pricePerShare[0] * appToken.supply];
  }

  getApy(_params: GetDataPropsParams<PoolTogetherV3Ticket>) {
    return 0;
  }

  async getDataProps(
    params: GetDataPropsParams<
      PoolTogetherV3Ticket,
      PoolTogetherV3CommunityTicketDataProps,
      PoolTogetherV3CommunityTicketDefinition
    >,
  ): Promise<PoolTogetherV3CommunityTicketDataProps> {
    const defaultDataProps = await super.getDataProps(params);
    return { ...defaultDataProps, poolType: params.definition.type };
  }
}
