import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { Register } from '~app-toolkit/decorators';
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
import { Network } from '~types';

import { StakeDaoContractFactory, StakeDaoGauge } from '../contracts';
import { STAKE_DAO_DEFINITION } from '../stake-dao.definition';

import { LOCKERS } from './stake-dao.locker.token-fetcher';

const appId = STAKE_DAO_DEFINITION.id;
const groupId = STAKE_DAO_DEFINITION.groups.gauge.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumStakeDaoGaugeContractPositionFetcher extends SingleStakingFarmDynamicTemplateContractPositionFetcher<StakeDaoGauge> {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'Gauges';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(StakeDaoContractFactory) protected readonly contractFactory: StakeDaoContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): StakeDaoGauge {
    return this.contractFactory.stakeDaoGauge({ address, network: this.network });
  }

  async getFarmAddresses() {
    return LOCKERS.map(v => v.gaugeAddress);
  }

  async getStakedTokenAddress({ contract }: GetTokenDefinitionsParams<StakeDaoGauge>) {
    return contract.staking_token();
  }

  async getRewardTokenAddresses({ contract }: GetTokenDefinitionsParams<StakeDaoGauge>) {
    const rewardTokenAddresses = await Promise.all(range(0, 4).map(async i => contract.reward_tokens(i)));
    return rewardTokenAddresses.map(v => v.toLowerCase()).filter(v => v !== ZERO_ADDRESS);
  }

  async getRewardRates({ contract, contractPosition }: GetDataPropsParams<StakeDaoGauge, SingleStakingFarmDataProps>) {
    const claimableTokens = contractPosition.tokens.filter(isClaimable);
    const rewardData = await Promise.all(claimableTokens.map(ct => contract.reward_data(ct.address)));
    return rewardData.map(v => v.rate);
  }

  getStakedTokenBalance({
    address,
    contract,
  }: GetTokenBalancesParams<StakeDaoGauge, SingleStakingFarmDataProps>): Promise<BigNumberish> {
    return contract.balanceOf(address);
  }

  getRewardTokenBalances({
    address,
    contractPosition,
    contract,
  }: GetTokenBalancesParams<StakeDaoGauge, SingleStakingFarmDataProps>) {
    const rewardTokens = contractPosition.tokens.filter(isClaimable);
    return Promise.all(rewardTokens.map(v => contract.claimable_reward(address, v.address)));
  }
}
