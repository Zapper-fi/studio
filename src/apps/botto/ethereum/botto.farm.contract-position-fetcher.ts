import { Inject } from '@nestjs/common';
import { BigNumber, BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetDataPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import {
  SingleStakingFarmDataProps,
  SingleStakingFarmDefinition,
  SingleStakingFarmTemplateContractPositionFetcher,
} from '~position/template/single-staking.template.contract-position-fetcher';

import { BottoViemContractFactory } from '../contracts';
import { BottoLiquidityMining } from '../contracts/viem';

@PositionTemplate()
export class EthereumBottoFarmContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<BottoLiquidityMining> {
  groupLabel = 'Farms';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BottoViemContractFactory) protected readonly contractFactory: BottoViemContractFactory,
  ) {
    super(appToolkit);
  }

  async getFarmDefinitions() {
    return [
      {
        address: '0xf8515cae6915838543bcd7756f39268ce8f853fd',
        stakedTokenAddress: '0x9ff68f61ca5eb0c6606dc517a9d44001e564bb66',
        rewardTokenAddresses: ['0x9dfad1b7102d46b1b197b90095b5c4e9f5845bba'],
      },
    ];
  }

  getContract(address: string) {
    return this.contractFactory.bottoLiquidityMining({ address, network: this.network });
  }

  async getRewardRates({ contract }: GetDataPropsParams<BottoLiquidityMining, SingleStakingFarmDataProps>) {
    const [totalRewards, startTime, endTime] = await Promise.all([
      contract.read.totalRewards(),
      contract.read.firstStakeTime(),
      contract.read.endTime(),
    ]);

    return BigNumber.from(totalRewards).div(BigNumber.from(endTime).sub(startTime));
  }

  async getIsActive({
    contract,
  }: GetDataPropsParams<
    BottoLiquidityMining,
    SingleStakingFarmDataProps,
    SingleStakingFarmDefinition
  >): Promise<boolean> {
    return BigNumber.from(await contract.read.endTime()).gt(Math.floor(Date.now() / 1000));
  }

  async getStakedTokenBalance({
    address,
    contract,
  }: GetTokenBalancesParams<BottoLiquidityMining, SingleStakingFarmDataProps>) {
    return contract.read.totalUserStake([address]);
  }

  async getRewardTokenBalances({
    address,
    contract,
  }: GetTokenBalancesParams<BottoLiquidityMining, SingleStakingFarmDataProps>): Promise<BigNumberish | BigNumberish[]> {
    return contract.simulate
      .withdraw({ account: address })
      .then(({ result }) => result[1])
      .catch(() => 0);
  }
}
