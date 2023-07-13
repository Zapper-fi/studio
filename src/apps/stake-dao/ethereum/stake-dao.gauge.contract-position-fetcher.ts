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
];

const LIQUID_LOCKER_BOOST_GAUGE_ADDRESSES = [
  '0x131dc928f9dad07f43ceff269e1674b7ebbfcbb1', // frxETH
  '0xa89b9c336764c9ae5f64bc19688601341974bc22', // STG/USDC
  '0x1250c0bb1e9d5831b052826b3eedb05cf91cca69', // Passive sEUR
  '0x991c79db98da75ead9f47286b64f63b878c52354', // Passive stETH
  '0x44b4e01c249e35b2803f947c5ccb9868c3421437', // TriCrypto USDC
  '0xdd571e39aa0df0bf142f6b81cba5923ddacf06a7', // TriCrypto USDT
  '0x4875d5e7987c93431e6db9dc53a136f46270f0dc', // crvUSD/USDT
  '0x3d27863670089841bbfd98b5440582b5958ecd55', // Passive sETH
  '0x62c6f1f58c0cc5915c9d414a470f06e137c3dbdb', // UZD/FRAXBP
  '0xbe77585f4159e674767acf91284160e8c09b96d8', // FRAX/USDC
  '0xc0a63f4f3033a1f09804624f9666fd214925fd06', // cvxCRV/CRV
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
    return [...LOCKER_GAUGE_ADDRESSES, ...LIQUID_LOCKER_BOOST_GAUGE_ADDRESSES];
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
