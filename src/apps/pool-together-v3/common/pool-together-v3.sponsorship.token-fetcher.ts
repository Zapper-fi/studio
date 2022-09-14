import { Inject } from '@nestjs/common';
import { compact } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Erc20 } from '~contract/contracts';
import { GetDataPropsParams, GetTokenPropsParams } from '~position/template/app-token.template.types';

import { PoolTogetherV3ContractFactory } from '../contracts';

import { PoolTogetherV3ApiPrizePoolRegistry } from './pool-together-v3.api.prize-pool-registry';
import {
  PoolTogetherV3PrizePoolDataProps,
  PoolTogetherV3PrizePoolDefinition,
  PoolTogetherV3PrizePoolTokenFetcher,
} from './pool-together-v3.prize-pool.token-fetcher';

export abstract class PoolTogetherV3SponsorshipTokenFetcher extends PoolTogetherV3PrizePoolTokenFetcher<Erc20> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PoolTogetherV3ContractFactory) protected readonly contractFactory: PoolTogetherV3ContractFactory,
    @Inject(PoolTogetherV3ApiPrizePoolRegistry)
    protected readonly poolTogetherV3ApiPrizePoolRegistry: PoolTogetherV3ApiPrizePoolRegistry,
  ) {
    super(appToolkit, contractFactory);
  }

  getContract(address: string): Erc20 {
    return this.contractFactory.erc20({ address, network: this.network });
  }

  async getDefinitions(): Promise<PoolTogetherV3PrizePoolDefinition[]> {
    const prizePools = await this.poolTogetherV3ApiPrizePoolRegistry.getV3PrizePools(this.network);

    return prizePools.map(prizePool => {
      const { tokenFaucets, ticketAddress, sponsorshipAddress, underlyingTokenAddress } = prizePool;
      return { address: sponsorshipAddress, ticketAddress, tokenFaucets, sponsorshipAddress, underlyingTokenAddress };
    });
  }

  async getSupply({ contract, definition }: GetTokenPropsParams<Erc20, PoolTogetherV3PrizePoolDefinition>) {
    const ticketContract = this.contractFactory.poolTogetherV3Ticket({
      network: this.network,
      address: definition.ticketAddress,
    });

    const [supplyRaw, ticketDecimals] = await Promise.all([contract.totalSupply(), ticketContract.decimals()]);
    return Number(supplyRaw) / 10 ** ticketDecimals;
  }

  async getDataProps(
    opts: GetDataPropsParams<Erc20, PoolTogetherV3PrizePoolDataProps, PoolTogetherV3PrizePoolDefinition>,
  ): Promise<PoolTogetherV3PrizePoolDataProps> {
    const { multicall, definition, appToken } = opts;
    const { supply: sponsorshipSupply, tokens } = appToken;
    const { ticketAddress, tokenFaucets } = definition;

    const underlyingToken = tokens[0];

    const ticketTokenContract = multicall.wrap(
      this.contractFactory.poolTogetherV3Ticket({
        address: ticketAddress,
        network: this.network,
      }),
    );

    const sponsorshipLiquidity = sponsorshipSupply * underlyingToken.price;

    const [ticketSupplyRaw, ticketDecimals] = await Promise.all([
      ticketTokenContract.totalSupply(),
      ticketTokenContract.decimals(),
    ]);
    const ticketSupply = Number(ticketSupplyRaw) / 10 ** ticketDecimals;

    const totalSupply = ticketSupply + sponsorshipSupply;
    const totalLiquidity = totalSupply * underlyingToken.price;

    const apy = await this.getApy({ ...opts, liquidity: totalLiquidity });
    const faucetAddresses = compact(tokenFaucets.map(tokenFaucet => tokenFaucet.tokenFaucetAddress));

    return {
      liquidity: sponsorshipLiquidity,
      faucetAddresses,
      apy,
    };
  }
}
