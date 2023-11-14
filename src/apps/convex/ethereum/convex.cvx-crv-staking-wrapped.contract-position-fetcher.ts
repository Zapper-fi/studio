import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { isSupplied } from '~position/position.utils';
import {
  DefaultContractPositionDefinition,
  GetDataPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';
import {
  SingleStakingFarmDataProps,
  SingleStakingFarmDynamicTemplateContractPositionFetcher,
} from '~position/template/single-staking.dynamic.template.contract-position-fetcher';

import { ConvexViemContractFactory } from '../contracts';
import { ConvexCvxCrvStakingWrapped } from '../contracts/viem';

@PositionTemplate()
export class EthereumConvexCvxCrvStakingWrappedContractPositionFetcher extends SingleStakingFarmDynamicTemplateContractPositionFetcher<ConvexCvxCrvStakingWrapped> {
  groupLabel = 'cvxCRV Staking Wrapped';

  cvxCrvStakingUtilitiesAddress = '0xadd2f542f9ff06405fabf8cae4a74bd0fe29c673';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ConvexViemContractFactory) protected readonly contractFactory: ConvexViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.convexCvxCrvStakingWrapped({ address, network: this.network });
  }

  getFarmAddresses(): string[] | Promise<string[]> {
    return ['0xaa0c3f5f7dfd688c6e646f66cd2a6b66acdbe434'];
  }

  getStakedTokenAddress({ contract }: GetTokenDefinitionsParams<ConvexCvxCrvStakingWrapped>) {
    return contract.read.cvxCrv();
  }

  async getRewardTokenAddresses({ contract }: GetTokenDefinitionsParams<ConvexCvxCrvStakingWrapped>) {
    const numRewards = await contract.read.rewardLength();
    const rewardTokenAddresses = await Promise.all(
      range(0, Number(numRewards)).map(async v => {
        const rewards = await contract.read.rewards([BigInt(v)]);
        return rewards[0].toLowerCase();
      }),
    );

    return rewardTokenAddresses;
  }

  getStakedTokenBalance({ address, contract }: GetTokenBalancesParams<ConvexCvxCrvStakingWrapped>) {
    return contract.read.balanceOf([address]);
  }

  async getRewardRates({
    multicall,
  }: GetDataPropsParams<ConvexCvxCrvStakingWrapped>): Promise<BigNumberish | BigNumberish[]> {
    const cvxCrvStakingUtilitiesCotnract = this.contractFactory.convexCvxCrvStakingUtilities({
      address: this.cvxCrvStakingUtilitiesAddress,
      network: this.network,
    });

    const defaultRewardRates = await multicall.wrap(cvxCrvStakingUtilitiesCotnract).read.mainRewardRates();

    return [...defaultRewardRates[1]];
  }

  async getRewardTokenBalances({ address, contract }: GetTokenBalancesParams<ConvexCvxCrvStakingWrapped>) {
    const rewards = await contract.simulate.earned([address]).then(v => v.result);
    return rewards.map(reward => Number(reward.amount));
  }

  async getReserve({
    contractPosition,
    multicall,
  }: GetDataPropsParams<
    ConvexCvxCrvStakingWrapped,
    SingleStakingFarmDataProps,
    DefaultContractPositionDefinition
  >): Promise<number> {
    const cvxCrvStakingContract = this.contractFactory.convexCvxCrvStaking({
      address: '0x3fe65692bfcd0e6cf84cb1e7d24108e434a7587e',
      network: this.network,
    });
    const stakedToken = contractPosition.tokens.find(isSupplied)!;
    const reserveRaw = await multicall.wrap(cvxCrvStakingContract).read.balanceOf([contractPosition.address]);
    const reserve = Number(reserveRaw) / 10 ** stakedToken.decimals;
    return reserve;
  }

  // temp until we figure out APY
  async getDataProps(
    params: GetDataPropsParams<ConvexCvxCrvStakingWrapped, SingleStakingFarmDataProps>,
  ): Promise<SingleStakingFarmDataProps> {
    const { contractPosition } = params;
    const stakedToken = contractPosition.tokens.find(isSupplied)!;

    const reserve = await this.getReserve(params);
    const liquidity = reserve * stakedToken.price;

    const apy = 0;
    const isActive = true;

    return { liquidity, apy, isActive };
  }
}
