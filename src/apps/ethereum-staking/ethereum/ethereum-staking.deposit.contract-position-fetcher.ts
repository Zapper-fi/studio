import { escape } from 'querystring';

import { Inject } from '@nestjs/common';
import axios from 'axios';
import BigNumber from 'bignumber.js';
import { gql } from 'graphql-request';
import { chunk } from 'lodash';

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

type BeaconChainBalanceHistory = {
  status: string;
  data: {
    balance: number;
    effectivebalance: number;
    epoch: number;
    validatorindex: number;
    week: number;
  }[];
};

type BeaconChainValidator = {
  status: string;
  data: {
    publickey: string;
    valid_signature: boolean;
    validatorindex: number;
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
    const depositsCount = await this.getDepositsCountFromSubgraph(address);

    if (depositsCount === 0) {
      return [0];
    }

    if (depositsCount > 500) {
      // If the user has more than 500 deposits, return the total amount deposited
      // NOTE - this subgraph kinda sucks, its not always accurate
      const balanceRaw = new BigNumber(depositsCount).times(32).times(1e18).toFixed(0);
      return [balanceRaw];
    }

    // Otherwise, attempt to retrieve accurate balances from the beaconcha.in API
    const indices = await this.getAllIndices(address);
    const totalBalanceRaw = await this.getTotalBalanceForIndices(indices);
    return [totalBalanceRaw];
  }

  private async getDepositsCountFromSubgraph(address: string) {
    const data = await gqlFetchAll<Eth2DepositsResponse>({
      endpoint: SUBGRAPH_DEPOSITS_ENDPOINT,
      query: ETH2_DEPOSITS_QUERY,
      dataToSearch: 'deposits',
      variables: {
        address: address.toLowerCase(),
      },
    });

    return data.deposits.length;
  }

  private async getAllIndices(address: string) {
    const axiosInstance = await this.getAxiosInstance();

    const { data: indicesData } = await axiosInstance.get<BeaconChainValidator>(
      `/validator/eth1/${address.toLowerCase()}`,
      { params: { limit: 2000 } },
    );

    let currentIndices = indicesData.data.map(({ validatorindex }) => validatorindex);
    let indices = indicesData.data.map(({ validatorindex }) => validatorindex);

    while (currentIndices.length === 2000) {
      const { data: indicesData } = await axiosInstance.get<BeaconChainValidator>(
        `/validator/eth1/${address.toLowerCase()}`,
        { params: { limit: 2000, offset: indices.length } },
      );

      currentIndices = indicesData.data.map(({ validatorindex }) => validatorindex);
      indices = [...indices, ...currentIndices];
    }

    return indices;
  }

  private async getTotalBalanceForIndices(indices: number[]) {
    const axiosInstance = await this.getAxiosInstance();
    const chunks = chunk(indices, 100); // Max 100 indices per request

    const allBalances = await Promise.all(
      chunks.map(chunk =>
        axiosInstance.get<BeaconChainBalanceHistory>(`/validator/${escape(chunk.join(','))}/balancehistory`, {
          params: {
            limit: 1,
          },
        }),
      ),
    );

    if (!allBalances.every(({ data }) => data.status === 'OK')) {
      throw new Error('Failed to fetch balance history');
    }

    // @TODO Custom balances would make more sense to split by indices
    const totalBalanceRawNormalized = allBalances.reduce(
      (acc, { data }) => acc.plus(data.data.reduce((acc, { balance }) => acc.plus(balance), new BigNumber(0))),
      new BigNumber(0),
    );

    const totalBalanceRaw = totalBalanceRawNormalized.div(1e9).times(1e18).toFixed(0);
    return totalBalanceRaw;
  }

  private async getAxiosInstance() {
    return axios.create({
      baseURL: BEACON_CHAIN_API_ENDPOINT,
      params: { apikey: process.env.BEACONCHAIN_API_KEY ?? '' },
    });
  }
}
