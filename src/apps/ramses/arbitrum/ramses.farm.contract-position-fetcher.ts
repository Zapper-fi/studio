import { Inject } from '@nestjs/common';
import { range } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { isClaimable } from '~position/position.utils';
import {
  GetTokenDefinitionsParams,
  GetDataPropsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';
import {
  SingleStakingFarmDataProps,
  SingleStakingFarmDynamicTemplateContractPositionFetcher,
} from '~position/template/single-staking.dynamic.template.contract-position-fetcher';

import { RamsesContractFactory, RamsesGauge } from '../contracts';

@PositionTemplate()
export class ArbitrumRamsesStakingContractPositionFetcher extends SingleStakingFarmDynamicTemplateContractPositionFetcher<RamsesGauge> {
  groupLabel = 'Staking';
  voterAddress = '0xaaa2564deb34763e3d05162ed3f5c2658691f499';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(RamsesContractFactory) protected readonly contractFactory: RamsesContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): RamsesGauge {
    return this.contractFactory.ramsesGauge({ address, network: this.network });
  }

  async getFarmAddresses() {
    const multicall = this.appToolkit.getMulticall(this.network);
    const ramsesVoter = this.contractFactory.ramsesVoter({ network: this.network, address: this.voterAddress });

    const numPools = await ramsesVoter.length();
    const pools = await Promise.all(range(0, Number(numPools)).map(v => multicall.wrap(ramsesVoter).pools(v)));
    const gauges = await Promise.all(pools.map(p => multicall.wrap(ramsesVoter).gauges(p)));
    return gauges.filter(v => v !== ZERO_ADDRESS);
  }

  async getStakedTokenAddress({ contract }: GetTokenDefinitionsParams<RamsesGauge>) {
    return contract.stake();
  }

  async getRewardTokenAddresses({ contract }: GetTokenDefinitionsParams<RamsesGauge>) {
    const numRewards = Number(await contract.rewardsListLength());
    return Promise.all(range(numRewards).map(async n => await contract.rewards(n)));
  }

  // @TODO: Find rewards rates which matches the APY returned from their API
  getRewardRates({ contractPosition }: GetDataPropsParams<RamsesGauge, SingleStakingFarmDataProps>) {
    const rewardTokens = contractPosition.tokens.filter(isClaimable);
    return Promise.all(rewardTokens.map(_rt => 0));
  }

  async getStakedTokenBalance({ address, contract }: GetTokenBalancesParams<RamsesGauge, SingleStakingFarmDataProps>) {
    const balance = await contract.balanceOf(address);
    return balance;
  }

  getRewardTokenBalances({
    address,
    contract,
    contractPosition,
  }: GetTokenBalancesParams<RamsesGauge, SingleStakingFarmDataProps>) {
    const rewardTokens = contractPosition.tokens.filter(isClaimable);
    return Promise.all(rewardTokens.map(rt => contract.earned(rt.address, address)));
  }
}
