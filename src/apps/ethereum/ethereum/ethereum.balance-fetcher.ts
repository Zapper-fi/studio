import { Inject } from '@nestjs/common';
import { BigNumber } from 'bignumber.js';
import { gql } from 'graphql-request';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { RocketPoolContractFactory } from '~apps/rocket-pool';
import { rocketMinipoolManagerAddress } from '~apps/rocket-pool/ethereum/rocket-pool.staking.contract-position-fetcher';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { ETHEREUM_DEFINITION } from '../ethereum.definition';

type Eth2DepositsResponse = {
  depositor: {
    depositCount: string;
  };
};

const GQL_ENDPOINT = `https://api.thegraph.com/subgraphs/name/smallonotation/eth2-genesis-analytics`;

const ETH2_DEPOSITS_QUERY = gql`
  query getEth2Deposits($address: String!) {
    depositor(id: $address) {
      depositCount
    }
  }
`;

const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(ETHEREUM_DEFINITION.id, network)
export class EthereumEthereumBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(RocketPoolContractFactory) private readonly rocketPoolContractFactory: RocketPoolContractFactory,
  ) {}

  async getStakedBalances(address: string) {
    return this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
      address,
      appId: ETHEREUM_DEFINITION.id,
      groupId: ETHEREUM_DEFINITION.groups.genesisDeposit.id,
      network,
      resolveBalances: async ({ contractPosition }) => {
        const token = contractPosition.tokens[0];
        const data = await this.appToolkit.helpers.theGraphHelper.request<Eth2DepositsResponse>({
          endpoint: GQL_ENDPOINT,
          query: ETH2_DEPOSITS_QUERY,
          variables: {
            address: address.toLowerCase(),
          },
        });

        const depositCount = Number(data.depositor?.depositCount ?? 0);
        if (depositCount === 0) return [drillBalance(token, '0')];

        const rocketPoolManager = this.rocketPoolContractFactory.rocketMinipoolManager({
          address: rocketMinipoolManagerAddress,
          network,
        });

        // To avoid double counting, deduct the number of minipools from the deposits associated with this address
        const minipoolCount = (await rocketPoolManager.getNodeActiveMinipoolCount(address)).toNumber();
        const poolCount = depositCount - minipoolCount;
        const balanceRaw = new BigNumber(poolCount).times(32).times(1e18).toFixed(0);
        return [drillBalance(token, balanceRaw)];
      },
    });
  }

  async getBalances(address: string) {
    const [stakedBalances] = await Promise.all([this.getStakedBalances(address)]);

    return presentBalanceFetcherResponse([
      {
        label: 'Genesis Deposits',
        assets: [...stakedBalances],
      },
    ]);
  }
}
