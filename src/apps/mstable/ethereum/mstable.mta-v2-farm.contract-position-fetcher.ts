import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetDataPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import {
  SingleStakingFarmDataProps,
  SingleStakingFarmDefinition,
  SingleStakingFarmTemplateContractPositionFetcher,
} from '~position/template/single-staking.template.contract-position-fetcher';

import { MstableViemContractFactory } from '../contracts';
import { MstableStakingV2 } from '../contracts/viem';

const MTA_V2_FARMS = [
  {
    address: '0x8f2326316ec696f6d023e37a9931c2b2c177a3d7',
    stakedTokenAddress: '0xa3bed4e1c75d00fa6f4e5e6922db7261b5e9acd2', // MTA
    rewardTokenAddresses: ['0xa3bed4e1c75d00fa6f4e5e6922db7261b5e9acd2'], // MTA
  },
  {
    address: '0xefbe22085d9f29863cfb77eed16d3cc0d927b011',
    stakedTokenAddress: '0xe2469f47ab58cf9cf59f9822e3c5de4950a41c49', // MTA / WETH Staking BPT
    rewardTokenAddresses: ['0xa3bed4e1c75d00fa6f4e5e6922db7261b5e9acd2'], // MTA
  },
];

@PositionTemplate()
export class EthereumMstableMtaV2FarmContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<MstableStakingV2> {
  groupLabel = 'MTA Staking V2';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(MstableViemContractFactory) protected readonly contractFactory: MstableViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.mstableStakingV2({ address, network: this.network });
  }

  async getFarmDefinitions(): Promise<SingleStakingFarmDefinition[]> {
    return MTA_V2_FARMS;
  }

  async getRewardRates({ contract }: GetDataPropsParams<MstableStakingV2, SingleStakingFarmDataProps>) {
    const lastRewardTimeRaw = await contract.read.lastTimeRewardApplicable();

    // Add an hour buffer for determining active state
    const now = Math.floor(Date.now() / 1000) - 60 * 60;
    const isActive = Number(lastRewardTimeRaw) >= now;
    if (!isActive) return [0];

    const globalData = await contract.read.globalData();
    return [globalData[2]];
  }

  async getIsActive({ contract }: GetDataPropsParams<MstableStakingV2>) {
    const lastRewardTimeRaw = await contract.read.lastTimeRewardApplicable();
    const now = Math.floor(Date.now() / 1000) - 60 * 60;
    const isActive = Number(lastRewardTimeRaw) >= now;
    return isActive;
  }

  async getStakedTokenBalance({
    address,
    contract,
  }: GetTokenBalancesParams<MstableStakingV2, SingleStakingFarmDataProps>) {
    return contract.read
      .rawBalanceOf([address])
      .then(v => BigNumber.from(v[0]).add(v[1]))
      .catch(() => BigNumber.from('0'));
  }

  async getRewardTokenBalances({
    address,
    contract,
  }: GetTokenBalancesParams<MstableStakingV2, SingleStakingFarmDataProps>) {
    return contract.read.earned([address]);
  }
}
