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
  GetUnderlyingTokensParams,
  GetDataPropsParams,
} from '~position/template/app-token.template.types';

import { PoolTogetherV3ViemContractFactory } from '../contracts';
import { PoolTogetherV3Ticket } from '../contracts/viem';

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
    @Inject(PoolTogetherV3ViemContractFactory) private readonly contractFactory: PoolTogetherV3ViemContractFactory,
    @Inject(PoolTogetherV3LogProvider) private readonly logProvider: PoolTogetherV3LogProvider,
  ) {
    super(appToolkit);
  }

  abstract TICKET_ADDRESS_RETURNED_BY_API: string[];

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

  getContract(address: string) {
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
          network: this.network,
          address,
        }),
      ),
    );

    // Build definitions
    const definitions = await Promise.all(
      builderLogs.flatMap(logs =>
        flatMap(logs, (logsForType, type: PoolWithMultipleWinnersBuilderCreatedType) =>
          logsForType.map(async ({ prizePool, prizeStrategy }) => {
            const contract = this.contractFactory.poolTogetherV3MultipleWinners({
              network: this.network,
              address: prizeStrategy,
            });

            const ticketAddress = await multicall
              .wrap(contract)
              .read.ticket()
              .then(addr => addr.toLowerCase());

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

    const allDefinitionsRaw = [...definitions, ...this.extraDefinitions];

    const allDefinitions = allDefinitionsRaw.filter(def => !this.BLOCKED_TICKET_ADDRESSES.includes(def.address));

    return allDefinitions.filter(x => !this.TICKET_ADDRESS_RETURNED_BY_API.includes(x.address));
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

  async getUnderlyingTokenDefinitions({
    definition,
    multicall,
  }: GetUnderlyingTokensParams<PoolTogetherV3Ticket, PoolTogetherV3CommunityTicketDefinition>) {
    const prizePool = this.contractFactory.poolTogetherV3CommunityPrizePool({
      network: this.network,
      address: definition.prizePool,
    });

    return [{ address: await multicall.wrap(prizePool).read.token(), network: this.network }];
  }

  async getPricePerShare() {
    return [1];
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
