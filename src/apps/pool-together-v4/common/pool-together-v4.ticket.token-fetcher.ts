import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  DefaultAppTokenDefinition,
  GetAddressesParams,
  GetDefinitionsParams,
  GetDisplayPropsParams,
  GetTokenPropsParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { PoolTogetherV4ViemContractFactory } from '../contracts';
import { PoolTogetherV4Ticket } from '../contracts/viem';

import { PoolTogetherV4ApiPrizePoolRegistry } from './pool-together-v4.api.prize-pool-registry';

type PoolTogetherV4TicketDefinition = DefaultAppTokenDefinition & {
  underlyingTokenAddress: string;
};

export abstract class PoolTogetherV4TicketTokenFetcher extends AppTokenTemplatePositionFetcher<
  PoolTogetherV4Ticket,
  DefaultAppTokenDataProps,
  PoolTogetherV4TicketDefinition
> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PoolTogetherV4ViemContractFactory) private readonly contractFactory: PoolTogetherV4ViemContractFactory,
    @Inject(PoolTogetherV4ApiPrizePoolRegistry)
    private readonly poolTogetherV4ApiPrizePoolRegistry: PoolTogetherV4ApiPrizePoolRegistry,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.poolTogetherV4Ticket({ address, network: this.network });
  }

  private async getPrizePoolAddresses() {
    const prizePools = await this.poolTogetherV4ApiPrizePoolRegistry.getV4PrizePools(this.network);
    return prizePools?.map(prizePoolAddresses => prizePoolAddresses.prizePoolAddress) || [];
  }

  async getAddresses({ definitions }: GetAddressesParams): Promise<string[]> {
    return definitions.map(({ address }) => address);
  }

  async getDefinitions(params: GetDefinitionsParams): Promise<PoolTogetherV4TicketDefinition[]> {
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
            .read.getTicket()
            .then(addr => addr.toLowerCase()),
          multicall
            .wrap(poolContract)
            .read.getToken()
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

  async getUnderlyingTokenDefinitions({
    definition,
  }: GetUnderlyingTokensParams<PoolTogetherV4Ticket, PoolTogetherV4TicketDefinition>) {
    return [{ address: definition.underlyingTokenAddress, network: this.network }];
  }

  async getSymbol({ appToken }: GetTokenPropsParams<PoolTogetherV4Ticket>): Promise<string> {
    return `pt${appToken.tokens[0].symbol}`;
  }

  async getPricePerShare() {
    return [1];
  }

  async getLabel({ appToken }: GetDisplayPropsParams<PoolTogetherV4Ticket>) {
    return `${getLabelFromToken(appToken.tokens[0])} Ticket`;
  }
}
