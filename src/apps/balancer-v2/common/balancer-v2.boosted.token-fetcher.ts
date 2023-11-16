import { Inject } from '@nestjs/common';
import { gql } from 'graphql-request';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  DefaultAppTokenDefinition,
  GetDisplayPropsParams,
  GetPricePerShareParams,
  GetTokenPropsParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { BalancerV2ViemContractFactory } from '../contracts';
import { BalancerBoostedPool } from '../contracts/viem/BalancerBoostedPool';

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

export abstract class BalancerV2PoolTokenFetcher extends AppTokenTemplatePositionFetcher<BalancerBoostedPool> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BalancerV2ViemContractFactory) protected readonly contractFactory: BalancerV2ViemContractFactory,
  ) {
    super(appToolkit);
  }

  abstract subgraphUrl: string;
  abstract vaultAddress: string;

  getContract(address: string) {
    return this.contractFactory.balancerBoostedPool({ address, network: this.network });
  }

  async getAddresses() {
    const poolsResponse = await gqlFetch<GetBoostedResponse>({
      endpoint: this.subgraphUrl,
      query: GET_BOOSTED_QUERY,
    });

    return poolsResponse.pools.map(x => x.address);
  }

  async getSupply({
    contract,
  }: GetTokenPropsParams<BalancerBoostedPool, DefaultAppTokenDataProps, DefaultAppTokenDefinition>) {
    return contract.read.getVirtualSupply();
  }

  async getUnderlyingTokenDefinitions({ contract, multicall }: GetUnderlyingTokensParams<BalancerBoostedPool>) {
    const _vault = this.contractFactory.balancerVault({ address: this.vaultAddress, network: this.network });
    const vault = multicall.wrap(_vault);

    const poolId = await contract.read.getPoolId();
    const [tokens] = await vault.read.getPoolTokens([poolId]);
    return [{ address: tokens[tokens.length - 1], network: this.network }];
  }

  async getPricePerShare({ appToken, multicall }: GetPricePerShareParams<BalancerBoostedPool>) {
    const _boosted = this.contractFactory.balancerErc4626LinearPool({
      address: appToken.address,
      network: this.network,
    });
    const boosted = multicall.wrap(_boosted);

    try {
      const [decimals, ratioRaw] = await Promise.all([boosted.read.decimals(), boosted.read.getWrappedTokenRate()]);

      return [Number(ratioRaw) / 10 ** Number(decimals)];
    } catch (error) {
      return [0];
    }
  }

  async getLabel({ appToken }: GetDisplayPropsParams<BalancerBoostedPool>): Promise<string> {
    return getLabelFromToken(appToken.tokens[0]);
  }
}
