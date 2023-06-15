import { Inject } from '@nestjs/common';
import { gql } from 'graphql-request';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  DefaultAppTokenDefinition,
  GetAddressesParams,
  GetDisplayPropsParams,
  GetPricePerShareParams,
  GetTokenPropsParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { BalancerV2ContractFactory } from '../contracts';
import { BalancerBoostedPool } from '../contracts/ethers/BalancerBoostedPool';

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
    @Inject(BalancerV2ContractFactory) protected readonly contractFactory: BalancerV2ContractFactory,
  ) {
    super(appToolkit);
  }

  abstract subgraphUrl: string;
  abstract vaultAddress: string;

  getContract(address: string): BalancerBoostedPool {
    return this.contractFactory.balancerBoostedPool({ address, network: this.network });
  }

  async getDefinitions(): Promise<{ address: string }[]> {
    const poolsResponse = await gqlFetch<GetBoostedResponse>({
      endpoint: this.subgraphUrl,
      query: GET_BOOSTED_QUERY,
    });

    return poolsResponse.pools;
  }

  async getAddresses({ definitions }: GetAddressesParams) {
    return definitions.map(v => v.address);
  }

  async getSupply({
    contract,
  }: GetTokenPropsParams<BalancerBoostedPool, DefaultAppTokenDataProps, DefaultAppTokenDefinition>) {
    return contract.getVirtualSupply();
  }

  async getUnderlyingTokenDefinitions({ contract, multicall }: GetUnderlyingTokensParams<BalancerBoostedPool>) {
    const _vault = this.contractFactory.balancerVault({ address: this.vaultAddress, network: this.network });
    const vault = multicall.wrap(_vault);

    const poolId = await contract.getPoolId();
    const { tokens } = await vault.getPoolTokens(poolId);
    return [{ address: tokens[tokens.length - 1], network: this.network }];
  }

  async getPricePerShare({ appToken, multicall }: GetPricePerShareParams<BalancerBoostedPool>) {
    const _boosted = this.contractFactory.balancerErc4626LinearPool({
      address: appToken.address,
      network: this.network,
    });
    const boosted = multicall.wrap(_boosted);

    const decimals = await boosted.decimals();
    const ratio = await boosted.getWrappedTokenRate();
    return [Number(ratio) / 10 ** Number(decimals)];
  }

  async getLabel({ appToken }: GetDisplayPropsParams<BalancerBoostedPool>): Promise<string> {
    return getLabelFromToken(appToken.tokens[0]);
  }
}
