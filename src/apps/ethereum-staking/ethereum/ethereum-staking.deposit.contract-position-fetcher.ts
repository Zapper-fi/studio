import { Inject } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { gql } from 'graphql-request';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
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
  }[];
};

const GQL_ENDPOINT = `https://api.thegraph.com/subgraphs/name/terryyyyyy/eth2staking`;

const ETH2_DEPOSITS_QUERY = gql`
  query getEth2Deposits($address: String!, $first: Int, $lastId: String) {
    deposits(where: { from: $address, isDepositor: true, id_gt: $lastId }, first: $first) {
      id
      amount
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
    return [{ metaType: MetaType.SUPPLIED, address: ZERO_ADDRESS }];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<EthereumStakingDeposit>) {
    return `${getLabelFromToken(contractPosition.tokens[0])} in Eth2 Deposit`;
  }

  async getTokenBalancesPerPosition({ address }: GetTokenBalancesParams<EthereumStakingDeposit>) {
    const data = await this.appToolkit.helpers.theGraphHelper.gqlFetchAll<Eth2DepositsResponse>({
      endpoint: GQL_ENDPOINT,
      query: ETH2_DEPOSITS_QUERY,
      dataToSearch: 'deposits',
      variables: {
        address: address.toLowerCase(),
      },
    });

    const balanceRaw = new BigNumber(data.deposits.length).times(32).times(1e18).toFixed(0);
    return [balanceRaw];
  }
}
