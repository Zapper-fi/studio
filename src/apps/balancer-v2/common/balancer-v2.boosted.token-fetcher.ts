import { Inject } from '@nestjs/common';
import { gql } from 'graphql-request';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetAddressesParams,
  GetDisplayPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { BalancerPool, BalancerV2ContractFactory } from '../contracts';


type GetBoostedResponse = {
  pools: {
    address: string;
  }[];
};

const GET_BOOSTED_QUERY = gql`
query getBoosted {
  pools(where: { poolType: "ERC4626Linear" }) {
    address
  }
}
`;

export abstract class BalancerV2PoolTokenFetcher extends AppTokenTemplatePositionFetcher<
  BalancerPool
> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BalancerV2ContractFactory) protected readonly contractFactory: BalancerV2ContractFactory,
  ) {
    super(appToolkit);
  }

  abstract subgraphUrl: string;
  abstract vaultAddress: string;

  getContract(address: string) {
    return this.contractFactory.balancerPool({ address, network: this.network });
  }

  async getDefinitions(): Promise<{ address: string }[]> {
    const poolsResponse = await gqlFetch<GetBoostedResponse>({
      endpoint: this.subgraphUrl,
      query: GET_BOOSTED_QUERY,
    });

    return poolsResponse.pools
  }

  async getAddresses({ definitions }: GetAddressesParams<{ address: string }>) {
    return definitions.map(v => v.address);
  }

  async getSupply({
    contract,
  }) {
    return contract.totalSupply();
  }

  async getUnderlyingTokenDefinitions({ contract, multicall }: GetUnderlyingTokensParams<BalancerPool>) {
    const _vault = this.contractFactory.balancerVault({ address: this.vaultAddress, network: this.network });
    const vault = multicall.wrap(_vault);

    const poolId = await contract.getPoolId();
    const { tokens } = await vault.getPoolTokens(poolId);
    return [{ address: tokens[tokens.length - 1], network: this.network }]
  }

  async getPricePerShare({ appToken, multicall }: GetPricePerShareParams<BalancerPool>) {
    const _boosted = this.contractFactory.balancerErc4626LinearPool({ address: appToken.address, network: this.network });
    const boosted = multicall.wrap(_boosted);

    const decimals = await boosted.decimals()
    const ratio = await boosted.getWrappedTokenRate();
    return [Number(ratio) / 10 ** Number(decimals)]
  }

  async getLabel({ appToken }: GetDisplayPropsParams<BalancerPool>): Promise<string> {
    return appToken.symbol
  }
}
