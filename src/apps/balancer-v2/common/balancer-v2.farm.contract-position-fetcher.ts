import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { gql } from 'graphql-request';
import { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
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

import { BalancerGauge, BalancerV2ContractFactory } from '../contracts';

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
    @Inject(BalancerV2ContractFactory) protected readonly contractFactory: BalancerV2ContractFactory,
  ) {
    super(appToolkit);
  }

  abstract subgraphUrl: string;

  getContract(address: string): BalancerGauge {
    return this.contractFactory.balancerGauge({ address, network: this.network });
  }

  async getFarmAddresses() {
    const gaugesResponse = await this.appToolkit.helpers.theGraphHelper.requestGraph<GaugesResponse>({
      endpoint: this.subgraphUrl,
      query: GAUGES_QUERY,
    });
    return gaugesResponse.liquidityGauges.map(({ id }) => id.toLowerCase());
  }

  async getStakedTokenAddress({ contract }: GetTokenDefinitionsParams<BalancerGauge>) {
    return contract.lp_token();
  }

  async getRewardTokenAddresses({ contract }: GetTokenDefinitionsParams<BalancerGauge>) {
    const rewardTokenAddresses = await Promise.all(range(0, 4).map(async i => contract.reward_tokens(i)));
    return rewardTokenAddresses.map(v => v.toLowerCase()).filter(v => v !== ZERO_ADDRESS);
  }

  async getRewardRates({ contract, contractPosition }: GetDataPropsParams<BalancerGauge, SingleStakingFarmDataProps>) {
    const claimableTokens = contractPosition.tokens.filter(isClaimable);
    const rewardData = await Promise.all(claimableTokens.map(ct => contract.reward_data(ct.address)));
    return rewardData.map(v => v.rate);
  }

  getStakedTokenBalance({
    address,
    contract,
  }: GetTokenBalancesParams<BalancerGauge, SingleStakingFarmDataProps>): Promise<BigNumberish> {
    return contract.balanceOf(address);
  }

  getRewardTokenBalances({
    address,
    contractPosition,
    contract,
  }: GetTokenBalancesParams<BalancerGauge, SingleStakingFarmDataProps>) {
    const rewardTokens = contractPosition.tokens.filter(isClaimable);
    return Promise.all(rewardTokens.map(v => contract.claimable_reward(address, v.address)));
  }
}
