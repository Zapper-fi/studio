import { Inject } from '@nestjs/common';
import { compact } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { GetDataPropsParams } from '~position/template/app-token.template.types';

import { PoolTogetherV3ContractFactory, PoolTogetherV3Ticket } from '../contracts';

import { PoolTogetherV3ApiPrizePoolRegistry } from './pool-together-v3.api.prize-pool-registry';
import {
  PoolTogetherV3PrizePoolDataProps,
  PoolTogetherV3PrizePoolDefinition,
  PoolTogetherV3PrizePoolTokenFetcher,
} from './pool-together-v3.prize-pool.token-fetcher';

export abstract class PoolTogetherV3TicketTokenFetcher extends PoolTogetherV3PrizePoolTokenFetcher<PoolTogetherV3Ticket> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PoolTogetherV3ContractFactory) protected readonly contractFactory: PoolTogetherV3ContractFactory,
    @Inject(PoolTogetherV3ApiPrizePoolRegistry)
    protected readonly poolTogetherV3ApiPrizePoolRegistry: PoolTogetherV3ApiPrizePoolRegistry,
  ) {
    super(appToolkit, contractFactory);
  }

  getContract(address: string): PoolTogetherV3Ticket {
    return this.contractFactory.poolTogetherV3Ticket({ address, network: this.network });
  }

  async getDefinitions(): Promise<PoolTogetherV3PrizePoolDefinition[]> {
    const prizePools = await this.poolTogetherV3ApiPrizePoolRegistry.getV3PrizePools(this.network);

    return prizePools.map(prizePool => {
      const { tokenFaucets, ticketAddress, sponsorshipAddress, underlyingTokenAddress } = prizePool;
      return { address: ticketAddress, ticketAddress, tokenFaucets, sponsorshipAddress, underlyingTokenAddress };
    });
  }

  async getDataProps(
    opts: GetDataPropsParams<PoolTogetherV3Ticket, PoolTogetherV3PrizePoolDataProps, PoolTogetherV3PrizePoolDefinition>,
  ): Promise<PoolTogetherV3PrizePoolDataProps> {
    const { multicall, definition, appToken } = opts;
    const { supply: ticketSupply, decimals: ticketDecimals, tokens } = appToken;
    const { sponsorshipAddress, tokenFaucets } = definition;

    const underlyingToken = tokens[0];

    const sponsorshipTokenContract = multicall.wrap(
      this.contractFactory.erc20({
        address: sponsorshipAddress,
        network: this.network,
      }),
    );

    const ticketLiquidity = ticketSupply * underlyingToken.price;

    const sponsorshipSupplyRaw = await sponsorshipTokenContract.totalSupply();
    const sponsorshipSupply = Number(sponsorshipSupplyRaw) / 10 ** ticketDecimals;

    const totalSupply = ticketSupply + sponsorshipSupply;
    const totalLiquidity = totalSupply * underlyingToken.price;

    const apy = await this.getApy({ ...opts, liquidity: totalLiquidity });
    const faucetAddresses = compact(tokenFaucets.map(tokenFaucet => tokenFaucet.tokenFaucetAddress));

    return {
      liquidity: ticketLiquidity,
      faucetAddresses,
      apy,
    };
  }
}
