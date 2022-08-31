import { Inject } from '@nestjs/common';
import { gql } from 'graphql-request';
import { compact, sumBy } from 'lodash';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { isClaimable, isSupplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { PolygonContractFactory } from '../contracts';
import { POLYGON_DEFINITION } from '../polygon.definition';

import { PolygonStakingContractPositionDataProps } from './polygon.staking.contract-position-fetcher';

type DelegatedMaticResponse = {
  delegators: {
    validatorId: string;
    delegatedAmount: string;
  }[];
};

const GQL_ENDPOINT = `https://api.thegraph.com/subgraphs/name/maticnetwork/mainnet-root-subgraphs`;

const DELEGATED_MATIC_QUERY = gql`
  query getDelegatedMatic($address: String!, $first: Int, $lastId: String) {
    delegators(where: { address: $address, id_gt: $lastId }, first: $first) {
      validatorId
      delegatedAmount
    }
  }
`;

const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(POLYGON_DEFINITION.id, network)
export class EthereumPolygonBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PolygonContractFactory) private readonly polygonContractFactory: PolygonContractFactory,
  ) {}

  async getDelegatedBalances(address: string) {
    const multicall = this.appToolkit.getMulticall(network);

    const data = await this.appToolkit.helpers.theGraphHelper.gqlFetchAll<DelegatedMaticResponse>({
      endpoint: GQL_ENDPOINT,
      query: DELEGATED_MATIC_QUERY,
      dataToSearch: 'delegators',
      variables: {
        address: address.toLowerCase(),
      },
    });

    const positions = await this.appToolkit.getAppContractPositions<PolygonStakingContractPositionDataProps>({
      appId: POLYGON_DEFINITION.id,
      groupIds: [POLYGON_DEFINITION.groups.staking.id],
      network,
    });

    const balances = await Promise.all(
      data.delegators.map(async delegator => {
        const position = positions.find(v => v.dataProps.validatorId === Number(delegator.validatorId));
        if (!position) return null;

        const contract = this.polygonContractFactory.polygonValidatorShare({
          address: position.dataProps.validatorShareAddress,
          network,
        });

        const [balanceRaw, claimableBalanceRaw] = await Promise.all([
          multicall.wrap(contract).balanceOf(address),
          multicall.wrap(contract).getLiquidRewards(address),
        ]);

        const suppliedToken = position.tokens.find(isSupplied);
        const claimableToken = position.tokens.find(isClaimable);
        if (!suppliedToken || !claimableToken) return null;

        const tokens = [
          drillBalance(suppliedToken, balanceRaw.toString()),
          drillBalance(claimableToken, claimableBalanceRaw.toString()),
        ];

        const balanceUSD = sumBy(tokens, v => v.balanceUSD);
        const balance: ContractPositionBalance<PolygonStakingContractPositionDataProps> = {
          ...position,
          tokens,
          balanceUSD,
        };

        return balance;
      }),
    );

    return compact(balances);
  }

  async getBalances(address: string) {
    const [delegatedBalances] = await Promise.all([this.getDelegatedBalances(address)]);

    return presentBalanceFetcherResponse([
      {
        label: 'Delegated',
        assets: [...delegatedBalances],
      },
    ]);
  }
}
