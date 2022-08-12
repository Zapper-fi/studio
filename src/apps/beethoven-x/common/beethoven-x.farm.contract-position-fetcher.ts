import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { gql } from 'graphql-request';
import { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { isClaimable } from '~position/position.utils';
import {
  DataPropsStageParams,
  GetTokenBalancesPerPositionParams,
} from '~position/template/contract-position.template.position-fetcher';
import {
  SingleStakingFarmDataProps,
  SingleStakingFarmDynamicTemplateContractPositionFetcher,
} from '~position/template/single-staking.dynamic.template.contract-position-fetcher';

import { BeethovenXContractFactory } from '../contracts';
import { BeethovenXGauge } from '../contracts/ethers/BeethovenXGauge';

export const GAUGES_QUERY = gql`
  {
    gauges {
      id
    }
  }
`;

export type GaugesResponse = {
  gauges: {
    id: string;
  }[];
};

export abstract class BeethovenXFarmContractPositionFetcher extends SingleStakingFarmDynamicTemplateContractPositionFetcher<BeethovenXGauge> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BeethovenXContractFactory) protected readonly contractFactory: BeethovenXContractFactory,
  ) {
    super(appToolkit);
  }

  abstract subgraphUrl: string;

  getContract(address: string): BeethovenXGauge {
    return this.contractFactory.beethovenXGauge({ address, network: this.network });
  }

  async getFarmAddresses() {
    const gaugesResponse = await this.appToolkit.helpers.theGraphHelper.requestGraph<GaugesResponse>({
      endpoint: this.subgraphUrl,
      query: GAUGES_QUERY,
    });
    return gaugesResponse.gauges.map(({ id }) => id.toLowerCase());
  }

  async getStakedTokenAddress(contract: BeethovenXGauge) {
    return contract.lp_token();
  }

  async getRewardTokenAddresses(contract: BeethovenXGauge) {
    const rewardTokenAddresses = await Promise.all(range(0, 4).map(async i => contract.reward_tokens(i)));
    return rewardTokenAddresses.map(v => v.toLowerCase()).filter(v => v !== ZERO_ADDRESS);
  }

  async getRewardRates({
    contract,
    contractPosition,
  }: DataPropsStageParams<BeethovenXGauge, SingleStakingFarmDataProps>) {
    const claimableTokens = contractPosition.tokens.filter(isClaimable);
    const rewardData = await Promise.all(claimableTokens.map(ct => contract.reward_data(ct.address)));
    return rewardData.map(v => v.rate);
  }

  getStakedTokenBalance({
    address,
    contract,
  }: GetTokenBalancesPerPositionParams<BeethovenXGauge, SingleStakingFarmDataProps>): Promise<BigNumberish> {
    return contract.balanceOf(address);
  }

  getRewardTokenBalances({
    address,
    contractPosition,
    contract,
  }: GetTokenBalancesPerPositionParams<BeethovenXGauge, SingleStakingFarmDataProps>) {
    const rewardTokens = contractPosition.tokens.filter(isClaimable);
    return Promise.all(rewardTokens.map(v => contract.claimable_reward(address, v.address)));
  }
}
