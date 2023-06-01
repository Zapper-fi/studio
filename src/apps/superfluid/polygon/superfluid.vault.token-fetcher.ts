import { Inject } from '@nestjs/common';
import { gql } from 'graphql-request';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

import { SuperfluidContractFactory, VaultToken } from '../contracts';

const ALL_SUPERTOKENS_QUERY = gql`
  {
    tokens(where: { isListed: true, isSuperToken: true }) {
      id
      symbol
      underlyingAddress
    }
  }
`;

type TokensResponse = {
  tokens: {
    id: string;
    symbol: string;
    underlyingAddress: string;
  }[];
};

@PositionTemplate()
export class PolygonSuperfluidVaultTokenFetcher extends AppTokenTemplatePositionFetcher<VaultToken> {
  groupLabel = 'Vaults';

  ignoredPools = ['0x263026e7e53dbfdce5ae55ade22493f828922965']; // RIC

  constructor(
    @Inject(SuperfluidContractFactory) private readonly contractFactory: SuperfluidContractFactory,
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
  ) {
    super(appToolkit);
  }

  getContract(address: string): VaultToken {
    return this.contractFactory.vaultToken({ network: this.network, address });
  }

  async getAddresses(): Promise<string[]> {
    const subgraphUrl = 'https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-v1-matic';
    const tokenDataRaw = await gqlFetch<TokensResponse>({
      endpoint: subgraphUrl,
      query: ALL_SUPERTOKENS_QUERY,
    });

    const tokenData = tokenDataRaw.tokens?.filter(x => !this.ignoredPools.includes(x.id));

    return tokenData.map(v => v.id) ?? [];
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<VaultToken>) {
    return [{ address: await contract.getUnderlyingToken(), network: this.network }];
  }

  async getPricePerShare() {
    return [1];
  }
}
