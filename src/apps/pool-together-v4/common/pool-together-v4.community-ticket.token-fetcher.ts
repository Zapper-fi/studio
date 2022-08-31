import { Inject } from '@nestjs/common';
import { flatMap } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { DefaultDataProps } from '~position/display.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDefinition,
  GetAddressesParams,
  GetDefinitionsParams,
  GetDisplayPropsParams,
} from '~position/template/app-token.template.types';
import { GetUnderlyingTokensParams, GetDataPropsParams } from '~position/template/app-token.template.types';

import { PoolTogetherV4ContractFactory, PoolTogetherV4Ticket } from '../contracts';

import { POOL_WITH_MULTIPLE_WINNERS_BUILDERS } from './pool-together-v4.community-ticket.pool-builders';
import { PoolTogetherV4LogProvider, PoolWithMultipleWinnersBuilderCreatedType } from './pool-together-v4.log-provider';

type Definition = DefaultAppTokenDefinition & {
  type: PoolWithMultipleWinnersBuilderCreatedType;
  address: string;
  prizeStrategy: string;
  prizePool: string;
};

type PoolTogetherV4CommunityTicketDataProps = {
  liquidity: number;
  poolType: PoolWithMultipleWinnersBuilderCreatedType;
};

export abstract class PoolTogetherV4CommunityTicketTokenFetcher extends AppTokenTemplatePositionFetcher<
  PoolTogetherV4Ticket,
  DefaultDataProps,
  Definition
> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PoolTogetherV4ContractFactory) private readonly contractFactory: PoolTogetherV4ContractFactory,
    @Inject(PoolTogetherV4LogProvider) private readonly logProvider: PoolTogetherV4LogProvider,
  ) {
    super(appToolkit);
  }

  extraDefinitions: Definition[] = [];

  private BLOCKED_TICKET_ADDRESSES = [
    '0x41ee149372238fbce0f3c5e7076aa253d0fc4c70',
    '0x73216f8173959b6abb6e78e80bd251071787042c',
    '0x96e22522fc2da00c74227f77d976f9b878ee5a62',
  ];

  private getCommunityPoolBuilders() {
    const poolBuilders = POOL_WITH_MULTIPLE_WINNERS_BUILDERS[this.network];
    return poolBuilders ?? [];
  }

  getContract(address: string): PoolTogetherV4Ticket {
    return this.contractFactory.poolTogetherV4Ticket({ address, network: this.network });
  }

  async getAddresses({ definitions }: GetAddressesParams): Promise<string[]> {
    return definitions.map(({ address }) => address);
  }

  async getDefinitions({ multicall }: GetDefinitionsParams): Promise<Definition[]> {
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
              this.contractFactory.poolTogetherV4MultipleWinners({
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
  }: GetDisplayPropsParams<PoolTogetherV4Ticket, PoolTogetherV4CommunityTicketDataProps, Definition>) {
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
  }: GetUnderlyingTokensParams<PoolTogetherV4Ticket, Definition>): Promise<string | string[]> {
    const contract = multicall.wrap(
      this.contractFactory.poolTogetherV4CommunityPrizePool({ network: this.network, address: definition.prizePool }),
    );
    const underlyingTokenAddress = await contract.token().then(addr => addr.toLowerCase());
    return [underlyingTokenAddress];
  }

  async getDataProps({
    appToken,
    definition,
  }: GetDataPropsParams<
    PoolTogetherV4Ticket,
    PoolTogetherV4CommunityTicketDataProps,
    Definition
  >): Promise<PoolTogetherV4CommunityTicketDataProps> {
    const underlyingToken = appToken.tokens[0];
    const liquidity = appToken.supply * underlyingToken.price;
    return { liquidity, poolType: definition.type };
  }
}
