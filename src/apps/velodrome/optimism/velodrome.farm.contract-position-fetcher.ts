import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { range } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
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
import { Network } from '~types/network.interface';

import { VelodromeContractFactory, VelodromeGauge } from '../contracts';
import { VELODROME_DEFINITION } from '../velodrome.definition';

import { VelodromeApiPairData } from './velodrome.pool.token-fetcher';

@Injectable()
export class OptimismVelodromeStakingContractPositionFetcher extends SingleStakingFarmDynamicTemplateContractPositionFetcher<VelodromeGauge> {
  appId = VELODROME_DEFINITION.id;
  groupId = VELODROME_DEFINITION.groups.farm.id;
  network = Network.OPTIMISM_MAINNET;
  groupLabel = 'Staking';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(VelodromeContractFactory) protected readonly contractFactory: VelodromeContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): VelodromeGauge {
    return this.contractFactory.velodromeGauge({ address, network: this.network });
  }

  async getFarmAddresses() {
    const { data } = await axios.get<{ data: VelodromeApiPairData[] }>('https://api.velodrome.finance/api/v1/pairs');
    const gaugeAddresses = data.data.map(pool => pool.gauge_address).filter(v => !!v);
    return gaugeAddresses;
  }

  async getStakedTokenAddress({ contract }: GetTokenDefinitionsParams<VelodromeGauge>) {
    return contract.stake();
  }

  async getRewardTokenAddresses({ contract }: GetTokenDefinitionsParams<VelodromeGauge>) {
    const numRewards = Number(await contract.rewardsListLength());
    return Promise.all(range(numRewards).map(async n => await contract.rewards(n)));
  }

  getRewardRates({ contract, contractPosition }: GetDataPropsParams<VelodromeGauge, SingleStakingFarmDataProps>) {
    const rewardTokens = contractPosition.tokens.filter(isClaimable);
    return Promise.all(rewardTokens.map(rt => contract.rewardPerToken(rt.address)));
  }

  async getStakedTokenBalance({
    address,
    contract,
  }: GetTokenBalancesParams<VelodromeGauge, SingleStakingFarmDataProps>) {
    return contract.balanceOf(address);
  }

  getRewardTokenBalances({
    address,
    contract,
    contractPosition,
  }: GetTokenBalancesParams<VelodromeGauge, SingleStakingFarmDataProps>) {
    const rewardTokens = contractPosition.tokens.filter(isClaimable);
    return Promise.all(rewardTokens.map(rt => contract.earned(rt.address, address)));
  }
}
