import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
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

import { StakeDaoContractFactory, StakeDaoGauge } from '../contracts';

const LOCKER_GAUGE_ADDRESSES = [
  '0x7f50786a0b15723d741727882ee99a0bf34e3466', // sdCRV
  '0x50dc9ae51f78c593d4138263da7088a973b8184e', // sdPENDLE
  '0x3e8c72655e48591d93e6dfda16823db0ff23d859', // sdBAL
  '0xf3c6e8fbb946260e8c2a55d48a5e01c82fd63106', // sdFRAX
  '0xe58101d3848e12dad6d7b5981dc11411bb267d2f', // sdFPIS
  '0x5adf559f5d24aacbe4fa3a3a4f44fdc7431e6b52', // sdYFI
  '0xe55843a90672f7d8218285e51ee8ff8e233f35d5', // sdANGLE
  '0x9c9d06c7378909c6d0a2a0017bb409f7fb8004e0', // sdAPW
  '0xa291faeef794df6216f196a63f514b5b22244865', // sdBPT
  '0xbcfe5c47129253c6b8a9a00565b3358b488d42e0', // sdFXN
  '0x5b75c60d45bfb053f91b5a9eae22519dfaa37bb6', // sdMAV
];

@PositionTemplate()
export class EthereumStakeDaoGaugeContractPositionFetcher extends SingleStakingFarmDynamicTemplateContractPositionFetcher<StakeDaoGauge> {
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
    const appTokens = await this.appToolkit.getAppTokenPositions({
      appId: this.appId,
      groupIds: ['angle-gauge', 'pendle-gauge', 'curve-gauge-2', 'balancer-gauge', 'gauge-curve-1'],
      network: this.network,
    });

    const gaugeAddresses = appTokens.map(x => x.address);

    return [...LOCKER_GAUGE_ADDRESSES, ...gaugeAddresses];
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
