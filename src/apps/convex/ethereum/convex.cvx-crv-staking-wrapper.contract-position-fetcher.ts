import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  GetDataPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';
import {
  SingleStakingFarmDataProps,
  SingleStakingFarmDynamicTemplateContractPositionFetcher,
} from '~position/template/single-staking.dynamic.template.contract-position-fetcher';

import { ConvexContractFactory, ConvexCvxCrvStakingWrapped } from '../contracts';

@PositionTemplate()
export class EthereumConvexCvxCrvStakingWrapperContractPositionFetcher extends SingleStakingFarmDynamicTemplateContractPositionFetcher<ConvexCvxCrvStakingWrapped> {
  groupLabel = 'cvxCRV Staking Wrapped';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ConvexContractFactory) protected readonly contractFactory: ConvexContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): ConvexCvxCrvStakingWrapped {
    return this.contractFactory.convexCvxCrvStakingWrapped({ address, network: this.network });
  }

  getFarmAddresses(): string[] | Promise<string[]> {
    return ['0xaa0c3f5f7dfd688c6e646f66cd2a6b66acdbe434'];
  }

  getStakedTokenAddress({ contract }: GetTokenDefinitionsParams<ConvexCvxCrvStakingWrapped>) {
    return contract.cvxCrv();
  }

  async getRewardTokenAddresses({ contract }: GetTokenDefinitionsParams<ConvexCvxCrvStakingWrapped>) {
    const numRewards = await contract.rewardLength();
    const rewardTokenAddresses = await Promise.all(
      range(0, Number(numRewards)).map(async v => {
        const rewards = await contract.rewards(v);
        return rewards.reward_token.toLowerCase();
      }),
    );

    return rewardTokenAddresses;
  }

  getStakedTokenBalance({ address, contract }: GetTokenBalancesParams<ConvexCvxCrvStakingWrapped>) {
    return contract.balanceOf(address);
  }

  async getRewardRates({
    multicall,
  }: GetDataPropsParams<ConvexCvxCrvStakingWrapped>): Promise<BigNumberish | BigNumberish[]> {
    const cvxCrvStakingUtilitiesCotnract = this.contractFactory.convexCvxCrvStakingUtilities({
      address: '0xadd2f542f9ff06405fabf8cae4a74bd0fe29c673',
      network: this.network,
    });

    const defaultRewardRates = await multicall.wrap(cvxCrvStakingUtilitiesCotnract).mainRewardRates();

    return defaultRewardRates.rates;
  }

  async getRewardTokenBalances() {
    return [0, 0, 0];
  }

  // Temp override preventing null and infinite
  async getDataProps(): Promise<SingleStakingFarmDataProps> {
    return { liquidity: 0, apy: 0, isActive: true };
  }
}
