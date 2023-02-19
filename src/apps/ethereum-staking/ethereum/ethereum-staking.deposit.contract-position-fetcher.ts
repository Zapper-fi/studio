import { escape } from 'querystring';

import { Inject } from '@nestjs/common';
import axios from 'axios';
import BigNumber from 'bignumber.js';
import { gql } from 'graphql-request';
import { uniq } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { gqlFetchAll } from '~app-toolkit/helpers/the-graph.helper';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { EthereumStakingContractFactory, EthereumStakingDeposit } from '../contracts';

type Eth2DepositsResponse = {
  deposits: {
    id: string;
    amount: string;
    index: number;
  }[];
};

type BeaconChainResponse = {
  status: string;
  data: {
    balance: number;
    effectivebalance: number;
    epoch: number;
    validatorindex: number;
    week: number;
  }[];
};

const SUBGRAPH_DEPOSITS_ENDPOINT = `https://api.thegraph.com/subgraphs/name/terryyyyyy/eth2staking`;
const BEACON_CHAIN_API_ENDPOINT = `https://beaconcha.in/api/v1`;

const ETH2_DEPOSITS_QUERY = gql`
  query getEth2Deposits($address: String!, $first: Int, $lastId: String) {
    deposits(where: { from: $address, isDepositor: true, id_gt: $lastId }, first: $first) {
      id
      amount
      index
    }
  }
`;

@PositionTemplate()
export class EthereumEthereumStakingDepositContractPositionFetcher extends ContractPositionTemplatePositionFetcher<EthereumStakingDeposit> {
  groupLabel = 'Deposits';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(EthereumStakingContractFactory) protected readonly contractFactory: EthereumStakingContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): EthereumStakingDeposit {
    return this.contractFactory.ethereumStakingDeposit({ address, network: this.network });
  }

  async getDefinitions() {
    return [{ address: '0x00000000219ab540356cbb839cbe05303d7705fa' }];
  }

  async getTokenDefinitions(_params: GetTokenDefinitionsParams<EthereumStakingDeposit>) {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: ZERO_ADDRESS,
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<EthereumStakingDeposit>) {
    return `${getLabelFromToken(contractPosition.tokens[0])} in Eth2 Deposit`;
  }

  async getTokenBalancesPerPosition({ address }: GetTokenBalancesParams<EthereumStakingDeposit>) {
    // First, hit the subgraph to see if the user has any deposits
    const depositsData = await gqlFetchAll<Eth2DepositsResponse>({
      endpoint: SUBGRAPH_DEPOSITS_ENDPOINT,
      query: ETH2_DEPOSITS_QUERY,
      dataToSearch: 'deposits',
      variables: {
        address: address.toLowerCase(),
      },
    });

    if (!depositsData.deposits.length) return [0];

    // Then, hit the beaconcha.in API to get the balance history (rate limit is 10 req/s, hence using the subgraph first)
    const indices = uniq(depositsData.deposits.map(deposit => deposit.index));
    const { data } = await axios.get<BeaconChainResponse>(`/validator/${escape(indices.join(','))}/balancehistory`, {
      baseURL: BEACON_CHAIN_API_ENDPOINT,
      params: {
        limit: 1,
      },
    });

    if (data.status !== 'OK') {
      throw new Error('Failed to fetch balance history');
    }

    // @TODO Custom balances would make more sense to split by indices
    const totalBalanceRawNormalized = data.data.reduce((acc, { balance }) => acc.plus(balance), new BigNumber(0));
    const totalBalanceRaw = totalBalanceRawNormalized.div(1e9).times(1e18).toFixed(0);
    return [totalBalanceRaw];
  }
}
