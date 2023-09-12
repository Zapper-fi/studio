import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetDataPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import {
  SingleStakingFarmDataProps,
  SingleStakingFarmDefinition,
  SingleStakingFarmTemplateContractPositionFetcher,
} from '~position/template/single-staking.template.contract-position-fetcher';

import { PieDaoContractFactory, PieDaoRewards } from '../contracts';

const FARMS = [
  // BPT WETH / DOUGH
  {
    address: '0xb9a4bca06f14a982fcd14907d31dfacadc8ff88e',
    stakedTokenAddress: '0xfae2809935233d4bfe8a56c2355c4a2e7d1fff1a',
    rewardTokenAddresses: ['0xad32a8e6220741182940c5abf610bde99e737b2d'],
  },
  // BPT DEFI+S / WETH
  {
    address: '0xfcbb61bcd4909bf4af708f15aaaa905e0978cafc',
    stakedTokenAddress: '0x35333cf3db8e334384ec6d2ea446da6e445701df',
    rewardTokenAddresses: ['0xad32a8e6220741182940c5abf610bde99e737b2d'],
  },
  // BPT DEFI+L / WETH
  {
    address: '0xb8e59ce1359d80e4834228edd6a3f560e7534438',
    stakedTokenAddress: '0xa795600590a7da0057469049ab8f1284baed977e',
    rewardTokenAddresses: ['0xad32a8e6220741182940c5abf610bde99e737b2d'],
  },
  // BCP
  {
    address: '0x9efd60f40e35b3ca7294cc268a35d3e35101be42',
    stakedTokenAddress: '0xe4f726adc8e89c6a6017f01eada77865db22da14',
    rewardTokenAddresses: ['0xad32a8e6220741182940c5abf610bde99e737b2d'],
  },
  // UNI-V2 YPIE / WETH
  {
    address: '0x3a05d2394f7241e00f4ae90a1f14d9c9c48a1e9b',
    stakedTokenAddress: '0xdf5096804705d135656b50b62f9ee13041253d97',
    rewardTokenAddresses: ['0xad32a8e6220741182940c5abf610bde99e737b2d'],
  },
];

@PositionTemplate()
export class EthereumPieDaoFarmSingleStakingContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<PieDaoRewards> {
  groupLabel = 'Farms';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PieDaoContractFactory) protected readonly contractFactory: PieDaoContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): PieDaoRewards {
    return this.contractFactory.pieDaoRewards({ address, network: this.network });
  }

  async getFarmDefinitions(): Promise<SingleStakingFarmDefinition[]> {
    return FARMS;
  }

  getRewardRates({ contract }: GetDataPropsParams<PieDaoRewards, SingleStakingFarmDataProps>) {
    return contract.rewardRate();
  }

  async getIsActive({ contract }: GetDataPropsParams<PieDaoRewards>) {
    return (await contract.rewardRate()).gt(0);
  }

  getStakedTokenBalance({ address, contract }: GetTokenBalancesParams<PieDaoRewards, SingleStakingFarmDataProps>) {
    return contract.balanceOf(address);
  }

  getRewardTokenBalances({ address, contract }: GetTokenBalancesParams<PieDaoRewards, SingleStakingFarmDataProps>) {
    return contract.earned(address);
  }
}
