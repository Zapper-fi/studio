import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';

import { PoolTogetherV3ViemContractFactory } from '../contracts';
import { PoolTogetherV3Ticket } from '../contracts/viem';

import { PoolTogetherV3ApiPrizePoolRegistry } from './pool-together-v3.api.prize-pool-registry';
import {
  PoolTogetherV3PrizePoolDefinition,
  PoolTogetherV3PrizePoolTokenFetcher,
} from './pool-together-v3.prize-pool.token-fetcher';

export abstract class PoolTogetherV3TicketTokenFetcher extends PoolTogetherV3PrizePoolTokenFetcher<PoolTogetherV3Ticket> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PoolTogetherV3ViemContractFactory) protected readonly contractFactory: PoolTogetherV3ViemContractFactory,
    @Inject(PoolTogetherV3ApiPrizePoolRegistry)
    protected readonly poolTogetherV3ApiPrizePoolRegistry: PoolTogetherV3ApiPrizePoolRegistry,
  ) {
    super(appToolkit, contractFactory);
  }

  getContract(address: string) {
    return this.contractFactory.poolTogetherV3Ticket({ address, network: this.network });
  }

  async getDefinitions(): Promise<PoolTogetherV3PrizePoolDefinition[]> {
    const prizePools = await this.poolTogetherV3ApiPrizePoolRegistry.getV3PrizePools(this.network);

    return prizePools.map(prizePool => {
      const { tokenFaucets, ticketAddress, sponsorshipAddress, underlyingTokenAddress } = prizePool;
      return { address: ticketAddress, ticketAddress, tokenFaucets, sponsorshipAddress, underlyingTokenAddress };
    });
  }
}
