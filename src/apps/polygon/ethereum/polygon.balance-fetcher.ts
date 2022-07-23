import { Inject } from '@nestjs/common';
import { gql } from 'graphql-request';
import { compact, sumBy } from 'lodash';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { Network } from '~types/network.interface';

import { POLYGON_DEFINITION } from '../polygon.definition';

import { PolygonStakingContractPositionDataProps } from './polygon.staking.contract-position-fetcher';

type Eth2DepositsResponse = {
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
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getDelegatedBalances(address: string) {
    const data = await this.appToolkit.helpers.theGraphHelper.gqlFetchAll<Eth2DepositsResponse>({
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

    const balances = data.delegators.map(delegator => {
      const position = positions.find(v => v.dataProps.validatorId === Number(delegator.validatorId));
      if (!position) return null;

      const tokens = [drillBalance(position.tokens[0], delegator.delegatedAmount)];
      const balanceUSD = sumBy(tokens, v => v.balanceUSD);
      const balance: ContractPositionBalance<PolygonStakingContractPositionDataProps> = {
        ...position,
        tokens,
        balanceUSD,
      };

      return balance;
    });

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
