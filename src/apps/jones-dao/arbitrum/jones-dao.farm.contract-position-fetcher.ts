import { Inject } from '@nestjs/common';
import _, { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetDataPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import {
  SingleStakingFarmDataProps,
  SingleStakingFarmDefinition,
  SingleStakingFarmTemplateContractPositionFetcher,
} from '~position/template/single-staking.template.contract-position-fetcher';

import { JonesDaoViemContractFactory } from '../contracts';
import { JonesStakingRewards } from '../contracts/viem';

@PositionTemplate()
export class ArbitrumJonesDaoFarmContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<JonesStakingRewards> {
  groupLabel = 'Farms';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(JonesDaoViemContractFactory) protected readonly contractFactory: JonesDaoViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.jonesStakingRewards({ address, network: this.network });
  }

  async getFarmDefinitions(): Promise<SingleStakingFarmDefinition[]> {
    const multicall = this.appToolkit.getViemMulticall(this.network);
    const factoryContract = this.contractFactory.jonesStakingRewardsFactory({
      address: '0x2c2082e4062bfd02141adc86cbd5e437201a1cf3',
      network: this.network,
    });
    const maybeStakingIds = await Promise.all(
      range(0, 50).map(
        async i =>
          await multicall
            .wrap(factoryContract)
            .read.stakingID([BigInt(i)])
            .catch(() => null),
      ),
    );
    const stakingIds = _.compact(maybeStakingIds).map(v => Number(v));
    const stakingInfo = await Promise.all(
      stakingIds.map(
        async i => await multicall.wrap(factoryContract).read.stakingRewardsInfoByStakingToken([BigInt(i)]),
      ),
    );
    const stakingAddresses = stakingInfo.map(v => v[0].toLowerCase());

    return Promise.all(
      stakingAddresses.map(async address => {
        const jonesStakingContract = this.contractFactory.jonesStakingRewards({
          address,
          network: this.network,
        });
        const stakedTokenAddress = await multicall.wrap(jonesStakingContract).read.stakingToken();

        return {
          address,
          stakedTokenAddress: stakedTokenAddress.toLowerCase(),
          rewardTokenAddresses: ['0x10393c20975cf177a3513071bc110f7962cd67da'],
        };
      }),
    );
  }

  getRewardRates({ contract }: GetDataPropsParams<JonesStakingRewards, SingleStakingFarmDataProps>) {
    return contract.read.rewardRateJONES();
  }

  async getIsActive({ contract }: GetDataPropsParams<JonesStakingRewards, SingleStakingFarmDataProps>) {
    const periodFinish = await contract.read.periodFinish();
    return Number(periodFinish) > Math.floor(Date.now() / 1000);
  }

  getStakedTokenBalance({
    address,
    contract,
  }: GetTokenBalancesParams<JonesStakingRewards, SingleStakingFarmDataProps>) {
    return contract.read.balanceOf([address]);
  }

  getRewardTokenBalances({
    address,
    contract,
  }: GetTokenBalancesParams<JonesStakingRewards, SingleStakingFarmDataProps>) {
    return contract.read.earned([address]);
  }
}
