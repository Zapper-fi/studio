import { Inject } from '@nestjs/common';
import { gql } from 'graphql-request';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { DefaultDataProps } from '~position/display.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetUnderlyingTokensParams, GetDataPropsParams } from '~position/template/app-token.template.types';

import { SuperfluidContractFactory, VaultToken } from '../contracts';

const ALL_TOKENS_QUERY = gql`
  {
    tokens {
      id
      symbol
      underlyingAddress
    }
  }
`;

type TokensResponse = {
  tokens?: {
    id: string;
    symbol: string;
    underlyingAddress: string;
  }[];
};

@PositionTemplate()
export class PolygonSuperfluidVaultTokenFetcher extends AppTokenTemplatePositionFetcher<VaultToken> {
  groupLabel = 'Vaults';

  readonly brokenAddresses = [
    '0x263026e7e53dbfdce5ae55ade22493f828922965',
    '0x3cf4866cd82a527d1a81438a9b132fae7f04732e',
    '0x73e454ad4526b2bd86c25fa4af756ab63865faef',
    '0x9f688d6857ebdf924a724180a2f3a2a1c6b47f22',
  ];

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
    const subgraphUrl = 'https://api.thegraph.com/subgraphs/name/superfluid-finance/superfluid-matic';
    const tokenData = await this.appToolkit.helpers.theGraphHelper.request<TokensResponse>({
      endpoint: subgraphUrl,
      query: ALL_TOKENS_QUERY,
    });

    return tokenData.tokens?.filter(x => !this.brokenAddresses.includes(x.id)).map(v => v.id) ?? [];
  }

  async getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensParams<VaultToken>) {
    return await contract.getUnderlyingToken();
  }

  async getDataProps(opts: GetDataPropsParams<VaultToken, DefaultDataProps>): Promise<DefaultDataProps> {
    const { appToken } = opts;
    const liquidity = appToken.price * appToken.supply;

    return { liquidity };
  }
}
