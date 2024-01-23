import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { gql } from 'graphql-request';
import { range } from 'lodash';

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

import { BalancerV2ViemContractFactory } from '../contracts';
import { BalancerGauge } from '../contracts/viem';

export const GAUGES_QUERY = gql`
  {
    liquidityGauges(first: 1000) {
      id
    }
  }
`;

export type GaugesResponse = {
  liquidityGauges: {
    id: string;
  }[];
};

export abstract class BalancerV2FarmContractPositionFetcher extends SingleStakingFarmDynamicTemplateContractPositionFetcher<BalancerGauge> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BalancerV2ViemContractFactory) protected readonly contractFactory: BalancerV2ViemContractFactory,
  ) {
    super(appToolkit);
  }

  abstract subgraphUrl: string;
  faultyRewardAddress?: string[] = [];

  getContract(address: string) {
    return this.contractFactory.balancerGauge({ address, network: this.network });
  }

  async getFarmAddresses() {
    const gaugesResponse = await gqlFetch<GaugesResponse>({
      endpoint: this.subgraphUrl,
      query: GAUGES_QUERY,
    });
    return gaugesResponse.liquidityGauges.map(({ id }) => id.toLowerCase());
  }

  async getStakedTokenAddress({ contract }: GetTokenDefinitionsParams<BalancerGauge>) {
    return contract.read.lp_token();
  }

  async getRewardTokenAddresses({ contract }: GetTokenDefinitionsParams<BalancerGauge>) {
    const rewardTokenAddressesRaw = await Promise.all(
      range(0, 4).map(async i => contract.read.reward_tokens([BigInt(i)])),
    );

    const rewardTokenAddresses = rewardTokenAddressesRaw.map(v => v.toLowerCase()).filter(v => v !== ZERO_ADDRESS);

    return rewardTokenAddresses.filter(x => !this.faultyRewardAddress?.includes(x));
  }

  async getRewardRates({ contract, contractPosition }: GetDataPropsParams<BalancerGauge, SingleStakingFarmDataProps>) {
    const claimableTokens = contractPosition.tokens.filter(isClaimable);
    const rewardData = await Promise.all(claimableTokens.map(ct => contract.read.reward_data([ct.address])));
    return rewardData.map(v => v.rate);
  }

  getStakedTokenBalance({
    address,
    contract,
  }: GetTokenBalancesParams<BalancerGauge, SingleStakingFarmDataProps>): Promise<BigNumberish> {
    return contract.read.balanceOf([address]);
  }

  async getRewardTokenBalances({
    address,
    contractPosition,
    contract,
  }: GetTokenBalancesParams<BalancerGauge, SingleStakingFarmDataProps>) {
    const rewardTokens = contractPosition.tokens.filter(isClaimable);
    if (!rewardTokens) return 0;

    return Promise.all(rewardTokens.map(v => contract.read.claimable_reward([address, v.address])));
  }
}
