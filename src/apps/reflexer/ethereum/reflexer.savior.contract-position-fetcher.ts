import { Inject } from '@nestjs/common';
import { gql } from 'graphql-request';
import { sumBy } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { drillBalance } from '~app-toolkit/helpers/drill-balance.helper';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { MetaType } from '~position/position.interface';
import { GetDisplayPropsParams } from '~position/template/contract-position.template.types';
import { CustomContractPositionTemplatePositionFetcher } from '~position/template/custom-contract-position.template.position-fetcher';

import { ReflexerContractFactory } from '../contracts';
import { ReflexerUniswapV2SafeSavior } from '../contracts/ethers/ReflexerUniswapV2SafeSavior';

type ReflexerSafesResponse = {
  safes: {
    collateral: string;
    safeId: string;
    debt: string;
    safeHandler: string;
  }[];
};

const safePositionsQuery = gql`
  query fetchSafePositions($address: String!) {
    safes(where: { owner: $address }) {
      debt
      collateral
      safeId
      safeHandler
    }
  }
`;

@PositionTemplate()
export class ReflexerSaviorContractPositionFetcher extends CustomContractPositionTemplatePositionFetcher<ReflexerUniswapV2SafeSavior> {
  groupLabel = 'Saviors';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ReflexerContractFactory) protected readonly contractFactory: ReflexerContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): ReflexerUniswapV2SafeSavior {
    return this.contractFactory.reflexerUniswapV2SafeSavior({ address, network: this.network });
  }

  async getDefinitions() {
    return [{ address: '0xa9402de5ce3f1e03be28871b914f77a4dd5e4364' }];
  }

  async getTokenDefinitions() {
    // UNI-V2 ETH / RAI
    return [
      { metaType: MetaType.SUPPLIED, address: '0x8ae720a71622e824f576b4a8c03031066548a3b1', network: this.network },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<ReflexerUniswapV2SafeSavior>) {
    return `Staked ${getLabelFromToken(contractPosition.tokens[0])} in Reflexer Safe Savior`;
  }

  // @ts-ignore
  getTokenBalancesPerPosition() {
    throw new Error('Method not implemented.');
  }

  async getBalances(address: string) {
    const safesResponse = await gqlFetch<ReflexerSafesResponse>({
      endpoint: `https://api.thegraph.com/subgraphs/name/reflexer-labs/rai-mainnet`,
      query: safePositionsQuery,
      variables: { address: address.toLowerCase() },
    });

    const multicall = this.appToolkit.getMulticall(this.network);
    const contractPositions = await this.appToolkit.getAppContractPositions({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });

    if (!contractPositions.length) return [];

    const balances = await Promise.all(
      safesResponse.safes.map(async safe => {
        const contractPosition = contractPositions[0];
        const contract = multicall.wrap(this.getContract(contractPosition.address));
        const balanceRaw = await contract.lpTokenCover(safe.safeHandler);

        const allTokens = [drillBalance(contractPosition.tokens[0], balanceRaw.toString())];
        const tokens = allTokens.filter(v => Math.abs(v.balanceUSD) > 0.01);
        const balanceUSD = sumBy(tokens, t => t.balanceUSD);

        const balance: ContractPositionBalance = { ...contractPosition, tokens, balanceUSD };
        return balance;
      }),
    );

    return balances;
  }
}
