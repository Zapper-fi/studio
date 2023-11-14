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
import { PlutusFarmPlsDpx } from '../contracts/viem';

export type PlutusFarmDefinition = SingleStakingFarmDefinition & {
  label: string;
};

@PositionTemplate()
export class ArbitrumPlutusFarmPlsDpxContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<
  PlutusFarmPlsDpx,
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
    return this.contractFactory.plutusFarmPlsDpx({ address, network: this.network });
  }

  async getFarmDefinitions(): Promise<PlutusFarmDefinition[]> {
    return [
      {
        address: '0x20df4953ba19c74b2a46b6873803f28bf640c1b5',
        stakedTokenAddress: '0xf236ea74b515ef96a9898f5a4ed4aa591f253ce1',
        label: 'plsDPX',
        rewardTokenAddresses: [
          '0x51318b7d00db7acc4026c88c3952b66278b6a67f', // PLS
          '0xf236ea74b515ef96a9898f5a4ed4aa591f253ce1', // plsDPX
          '0xe7f6c3c1f0018e4c08acc52965e5cbff99e34a44', // plsJONES
          '0x6c2c06790b3e3e3c38e12ee22f8183b37a13ee55', // DPX
          '0x32eb7902d4134bf98a28b963d26de779af92a212', // rDPX
        ],
      },
    ];
  }

  async getRewardRates({ contract }: GetDataPropsParams<PlutusFarmPlsDpx, SingleStakingFarmDataProps>) {
    const rewardsDistro = await contract.read.rewardsDistro();
    const rewardsDistroContract = this.contractFactory.plutusRewardsDistroPlsDpx({
      address: rewardsDistro,
      network: this.network,
    });

    const [pls, plsDpx, plsJones, dpx, rdpx] = await rewardsDistroContract.read.getEmissions();
    return [pls, plsDpx, plsJones, dpx, rdpx];
  }

  async getIsActive({
    contract,
  }: GetDataPropsParams<PlutusFarmPlsDpx, SingleStakingFarmDataProps, PlutusFarmDefinition>): Promise<boolean> {
    const rewardsDistro = await contract.read.rewardsDistro();
    const rewardsDistroContract = this.contractFactory.plutusRewardsDistroPlsDpx({
      address: rewardsDistro,
      network: this.network,
    });

    const [pls, plsDpx, plsJones, dpx, rdpx] = await rewardsDistroContract.read.getEmissions();
    return Number(pls) > 0 || Number(plsDpx) > 0 || Number(plsJones) > 0 || Number(dpx) > 0 || Number(rdpx) > 0;
  }

  async getLabel({
    definition,
  }: GetDisplayPropsParams<PlutusFarmPlsDpx, SingleStakingFarmDataProps, PlutusFarmDefinition>) {
    return definition.label;
  }

  async getStakedTokenBalance({ contract, address }: GetTokenBalancesParams<PlutusFarmPlsDpx>) {
    return contract.read.userInfo([address]).then(v => v[0]);
  }

  async getRewardTokenBalances({ contract, address }: GetTokenBalancesParams<PlutusFarmPlsDpx>) {
    return contract.read.pendingRewards([address]).then(v => [...v]);
  }
}
