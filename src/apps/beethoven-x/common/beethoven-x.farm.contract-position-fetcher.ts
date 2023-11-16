import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { gql } from 'graphql-request';
import _, { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';
import { isClaimable } from '~position/position.utils';
import {
  GetDataPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';
import {
  SingleStakingFarmDataProps,
  SingleStakingFarmDynamicTemplateContractPositionFetcher,
} from '~position/template/single-staking.dynamic.template.contract-position-fetcher';

import { BeethovenXViemContractFactory } from '../contracts';
import { BeethovenXGauge } from '../contracts/viem/BeethovenXGauge';

export const GAUGES_QUERY = gql`
  {
    poolGetPools(where: { chainIn: [OPTIMISM] }) {
      staking {
        id
      }
    }
  }
`;

export type GaugesResponse = {
  poolGetPools: {
    staking: {
      id: string;
    } | null;
  }[];
};

export abstract class BeethovenXFarmContractPositionFetcher extends SingleStakingFarmDynamicTemplateContractPositionFetcher<BeethovenXGauge> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BeethovenXViemContractFactory) protected readonly contractFactory: BeethovenXViemContractFactory,
  ) {
    super(appToolkit);
  }

  abstract subgraphUrl: string;

  getContract(address: string) {
    return this.contractFactory.beethovenXGauge({ address, network: this.network });
  }

  async getFarmAddresses() {
    const gaugesResponse = await gqlFetch<GaugesResponse>({
      endpoint: this.subgraphUrl,
      query: GAUGES_QUERY,
    });

    const gaugesAddressesRaw = gaugesResponse.poolGetPools.map(({ staking }) => staking?.id);

    return _.compact(gaugesAddressesRaw);
  }

  async getStakedTokenAddress({ contract }: GetTokenDefinitionsParams<BeethovenXGauge>) {
    return contract.read.lp_token();
  }

  async getRewardTokenAddresses({ contract }: GetTokenDefinitionsParams<BeethovenXGauge>) {
    const rewardTokenAddresses = await Promise.all(
      range(0, 4).map(async i => contract.read.reward_tokens([BigInt(i)])),
    );
    return rewardTokenAddresses.map(v => v.toLowerCase()).filter(v => v !== ZERO_ADDRESS);
  }

  async getRewardRates({
    contract,
    contractPosition,
  }: GetDataPropsParams<BeethovenXGauge, SingleStakingFarmDataProps>) {
    const claimableTokens = contractPosition.tokens.filter(isClaimable);
    const rewardData = await Promise.all(claimableTokens.map(ct => contract.read.reward_data([ct.address])));
    return rewardData.map(v => v.rate);
  }

  getStakedTokenBalance({
    address,
    contract,
  }: GetTokenBalancesParams<BeethovenXGauge, SingleStakingFarmDataProps>): Promise<BigNumberish> {
    return contract.read.balanceOf([address]);
  }

  getRewardTokenBalances({
    address,
    contractPosition,
    contract,
  }: GetTokenBalancesParams<BeethovenXGauge, SingleStakingFarmDataProps>) {
    const rewardTokens = contractPosition.tokens.filter(isClaimable);
    return Promise.all(rewardTokens.map(v => contract.read.claimable_reward([address, v.address])));
  }
}
