import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { DefaultDataProps } from '~position/display.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDefinition,
  GetAddressesParams,
  GetDefinitionsParams,
} from '~position/template/app-token.template.types';
import { GetUnderlyingTokensParams, GetDataPropsParams } from '~position/template/app-token.template.types';

import { PoolTogetherV4ContractFactory, PoolTogetherV4Ticket } from '../contracts';

import { PoolTogetherV4ApiPrizePoolRegistry } from './pool-together-v4.api.prize-pool-registry';

type Definition = DefaultAppTokenDefinition & {
  underlyingTokenAddress: string;
};

type PoolTogetherV4TicketDataProps = {
  liquidity: number;
};

export abstract class PoolTogetherV4TicketTokenFetcher extends AppTokenTemplatePositionFetcher<
  PoolTogetherV4Ticket,
  DefaultDataProps,
  Definition
> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PoolTogetherV4ContractFactory) private readonly contractFactory: PoolTogetherV4ContractFactory,
    @Inject(PoolTogetherV4ApiPrizePoolRegistry)
    private readonly poolTogetherV4ApiPrizePoolRegistry: PoolTogetherV4ApiPrizePoolRegistry,
  ) {
    super(appToolkit);
  }

  getContract(address: string): PoolTogetherV4Ticket {
    return this.contractFactory.poolTogetherV4Ticket({ address, network: this.network });
  }

  private async getPrizePoolAddresses() {
    const prizePools = await this.poolTogetherV4ApiPrizePoolRegistry.getV4PrizePools(this.network);
    return prizePools?.map(prizePoolAddresses => prizePoolAddresses.prizePoolAddress) || [];
  }

  async getAddresses({ definitions }: GetAddressesParams): Promise<string[]> {
    return definitions.map(({ address }) => address);
  }

  async getDefinitions(params: GetDefinitionsParams): Promise<Definition[]> {
    const { multicall } = params;
    const addresses = await this.getPrizePoolAddresses();

    const definitions = await Promise.all(
      addresses.map(async prizePoolAddress => {
        const poolContract = this.contractFactory.poolTogetherV4PrizePool({
          network: this.network,
          address: prizePoolAddress,
        });

        // Retrieve ticket token and deposit token
        const [ticketTokenAddress, underlyingTokenAddress] = await Promise.all([
          multicall
            .wrap(poolContract)
            .getTicket()
            .then(addr => addr.toLowerCase()),
          multicall
            .wrap(poolContract)
            .getToken()
            .then(addr => addr.toLowerCase()),
        ]);

        return {
          address: ticketTokenAddress,
          underlyingTokenAddress,
        };
      }),
    );

    return definitions;
  }

  async getUnderlyingTokenAddresses({
    definition,
  }: GetUnderlyingTokensParams<PoolTogetherV4Ticket, Definition>): Promise<string | string[]> {
    return [definition.underlyingTokenAddress];
  }

  async getDataProps({
    appToken,
  }: GetDataPropsParams<
    PoolTogetherV4Ticket,
    PoolTogetherV4TicketDataProps,
    Definition
  >): Promise<PoolTogetherV4TicketDataProps> {
    const underlyingToken = appToken.tokens[0];
    const liquidity = appToken.supply * underlyingToken.price;
    return { liquidity };
  }
}
