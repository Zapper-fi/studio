import { Inject } from '@nestjs/common';
import { gql } from 'graphql-request';
import { sumBy } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { drillBalance } from '~app-toolkit/helpers/drill-balance.helper';
import { getAppAssetImage } from '~app-toolkit/helpers/presentation/image.present';
import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';
import { ContractType } from '~position/contract.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { MetaType } from '~position/position.interface';
import {
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
  UnderlyingTokenDefinition,
} from '~position/template/contract-position.template.types';
import { CustomContractPositionTemplatePositionFetcher } from '~position/template/custom-contract-position.template.position-fetcher';

import { KwentaViemContractFactory } from '../contracts';
import { KwentaPerp } from '../contracts/viem';

type GetCrossMarginAccounts = {
  crossMarginAccounts: {
    id: string;
  }[];
};

const getCrossMarginAccountsQuery = gql`
  query MyQuery($address: String!) {
    crossMarginAccounts(where: { owner: $address }) {
      id
    }
  }
`;

@PositionTemplate()
export class OptimismKwentaPerpV1CrossMarginContractPositionFetcher extends CustomContractPositionTemplatePositionFetcher<KwentaPerp> {
  groupLabel = 'Perp V1 Cross-Margin';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(KwentaViemContractFactory) protected readonly contractFactory: KwentaViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.kwentaPerp({ address, network: this.network });
  }

  async getDefinitions() {
    return []; // Resolve from Synthetix
  }

  async getLabel(_params: GetDisplayPropsParams<KwentaPerp>): Promise<string> {
    throw new Error('Method not implemented.');
  }

  async getTokenDefinitions(_params: GetTokenDefinitionsParams<KwentaPerp>): Promise<UnderlyingTokenDefinition[]> {
    throw new Error('Method not implemented.');
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<KwentaPerp>) {
    const remainingMargin = await contract.read.remainingMargin([address]);
    return [remainingMargin[0]];
  }

  async getMarginAccountAddress(address: string): Promise<string> {
    const crossMarginAccountsFromSubgraph = await gqlFetch<GetCrossMarginAccounts>({
      endpoint: 'https://api.thegraph.com/subgraphs/name/kwenta/optimism-main?source=zapper',
      query: getCrossMarginAccountsQuery,
      variables: { address: address },
    });

    if (crossMarginAccountsFromSubgraph.crossMarginAccounts.length === 0) {
      return ZERO_ADDRESS;
    }

    return crossMarginAccountsFromSubgraph.crossMarginAccounts[0].id;
  }

  async getBalances(address: string): Promise<ContractPositionBalance[]> {
    const multicall = this.appToolkit.getViemMulticall(this.network);
    if (address === ZERO_ADDRESS) return [];

    const marginAccountAddress = await this.getMarginAccountAddress(address);
    if (marginAccountAddress === ZERO_ADDRESS) return [];

    const contractPositions = await this.appToolkit.getAppContractPositions({
      appId: 'synthetix',
      network: this.network,
      groupIds: ['perp-v1'],
    });

    const balances = await Promise.all(
      contractPositions.map(async contractPosition => {
        const contract = multicall.wrap(this.getContract(contractPosition.address));
        const balancesRaw = await this.getTokenBalancesPerPosition({
          address: marginAccountAddress,
          contract,
          contractPosition,
          multicall,
        });

        const allTokens = contractPosition.tokens.map((cp, idx) =>
          drillBalance(cp, balancesRaw[idx]?.toString() ?? '0', { isDebt: cp.metaType === MetaType.BORROWED }),
        );

        const tokens = allTokens.filter(v => Math.abs(v.balanceUSD) > 0.01);
        const balanceUSD = sumBy(tokens, t => t.balanceUSD);

        const balance: ContractPositionBalance = {
          type: ContractType.POSITION,
          address: marginAccountAddress,
          network: this.network,
          appId: this.appId,
          groupId: this.groupId,
          groupLabel: this.groupLabel,
          tokens,
          dataProps: contractPosition.dataProps,
          displayProps: {
            ...contractPosition.displayProps,
            images: [getAppAssetImage(this.appId, `s${contractPosition.dataProps.asset}`)],
          },
          balanceUSD,
        };

        return balance;
      }),
    );

    return balances;
  }
}
