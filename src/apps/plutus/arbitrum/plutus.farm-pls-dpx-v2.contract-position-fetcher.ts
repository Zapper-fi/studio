import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';
import {
  SingleStakingFarmDataProps,
  SingleStakingFarmDefinition,
  SingleStakingFarmTemplateContractPositionFetcher,
} from '~position/template/single-staking.template.contract-position-fetcher';

import { PlutusViemContractFactory } from '../contracts';
import { PlutusFarmPlsDpxV2 } from '../contracts/viem';

export type PlutusFarmDefinition = SingleStakingFarmDefinition & {
  label: string;
};

@PositionTemplate()
export class ArbitrumPlutusFarmPlsDpxV2ContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<
  PlutusFarmPlsDpxV2,
  SingleStakingFarmDataProps,
  PlutusFarmDefinition
> {
  groupLabel = 'Farms';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PlutusViemContractFactory) protected readonly contractFactory: PlutusViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.plutusFarmPlsDpxV2({ address, network: this.network });
  }

  async getFarmDefinitions(): Promise<PlutusFarmDefinition[]> {
    return [
      {
        address: '0x75c143460f6e3e22f439dff947e25c9ccb72d2e8',
        stakedTokenAddress: '0xf236ea74b515ef96a9898f5a4ed4aa591f253ce1',
        label: 'plsDPX-v2',
        rewardTokenAddresses: [
          '0x51318b7d00db7acc4026c88c3952b66278b6a67f', // PLS
          '0xf236ea74b515ef96a9898f5a4ed4aa591f253ce1', // plsDPX
          '0xe7f6c3c1f0018e4c08acc52965e5cbff99e34a44', // plsJONES
          '0x6c2c06790b3e3e3c38e12ee22f8183b37a13ee55', // DPX
        ],
      },
    ];
  }

  async getRewardRates({ contract }: GetDataPropsParams<PlutusFarmPlsDpxV2, SingleStakingFarmDataProps>) {
    const rewardsDistro = await contract.read.REWARDS_DISTRO();
    const rewardsDistroContract = this.contractFactory.plutusRewardsDistroPlsDpxV2({
      address: rewardsDistro,
      network: this.network,
    });

    const [pls, plsDpx, plsJones, pendingDpxLessFee] = await rewardsDistroContract.read.getEmissions();
    const lastRewardSecond = await contract.read.lastRewardSecond();
    const duration = Date.now() / 1000 - lastRewardSecond;
    const dpxEmissions = Number(pendingDpxLessFee) / duration;

    return [pls, plsDpx, plsJones, dpxEmissions];
  }

  async getIsActive({
    contract,
  }: GetDataPropsParams<PlutusFarmPlsDpxV2, SingleStakingFarmDataProps, PlutusFarmDefinition>): Promise<boolean> {
    const rewardsDistro = await contract.read.REWARDS_DISTRO();
    const rewardsDistroContract = this.contractFactory.plutusRewardsDistroPlsDpxV2({
      address: rewardsDistro,
      network: this.network,
    });

    const [pls, plsDpx, plsJones, pendingDpxLessFee] = await rewardsDistroContract.read.getEmissions();
    const lastRewardSecond = await contract.read.lastRewardSecond();
    const duration = Date.now() / 1000 - lastRewardSecond;
    const dpxEmissions = Number(pendingDpxLessFee) / duration;

    return pls > 0 || plsDpx > 0 || plsJones > 0 || dpxEmissions > 0;
  }

  async getLabel({
    definition,
  }: GetDisplayPropsParams<PlutusFarmPlsDpxV2, SingleStakingFarmDataProps, PlutusFarmDefinition>) {
    return definition.label;
  }

  async getStakedTokenBalance({ contract, address }: GetTokenBalancesParams<PlutusFarmPlsDpxV2>) {
    return contract.read.userInfo([address]).then(v => v[0]);
  }

  async getRewardTokenBalances({ contract, address }: GetTokenBalancesParams<PlutusFarmPlsDpxV2>) {
    return contract.read.pendingRewards([address]).then(v => [...v]);
  }
}
