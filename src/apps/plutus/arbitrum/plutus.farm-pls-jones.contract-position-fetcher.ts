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
import { PlutusFarmPlsJones } from '../contracts/viem';

export type PlutusFarmDefinition = SingleStakingFarmDefinition & {
  label: string;
};

@PositionTemplate()
export class ArbitrumPlutusFarmPlsJonesContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<
  PlutusFarmPlsJones,
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
    return this.contractFactory.plutusFarmPlsJones({ address, network: this.network });
  }

  async getFarmDefinitions(): Promise<PlutusFarmDefinition[]> {
    return [
      {
        address: '0x23b87748b615096d1a0f48870daee203a720723d',
        stakedTokenAddress: '0xe7f6c3c1f0018e4c08acc52965e5cbff99e34a44',
        label: 'plsJONES',
        rewardTokenAddresses: [
          '0x51318b7d00db7acc4026c88c3952b66278b6a67f', // PLS
          '0xf236ea74b515ef96a9898f5a4ed4aa591f253ce1', // plsDPX
          '0xe7f6c3c1f0018e4c08acc52965e5cbff99e34a44', // plsJONES
          '0x10393c20975cf177a3513071bc110f7962cd67da', // JONES
        ],
      },
    ];
  }

  async getRewardRates({ contract }: GetDataPropsParams<PlutusFarmPlsJones, SingleStakingFarmDataProps>) {
    const rewardsDistro = await contract.read.rewardsDistro();
    const rewardsDistroContract = this.contractFactory.plutusRewardsDistroPlsJones({
      address: rewardsDistro,
      network: this.network,
    });

    const [pls, plsDpx, plsJones, jones] = await rewardsDistroContract.read.getEmissions();
    return [pls, plsDpx, plsJones, jones];
  }

  async getIsActive({
    contract,
  }: GetDataPropsParams<PlutusFarmPlsJones, SingleStakingFarmDataProps, PlutusFarmDefinition>): Promise<boolean> {
    const rewardsDistro = await contract.read.rewardsDistro();
    const rewardsDistroContract = this.contractFactory.plutusRewardsDistroPlsJones({
      address: rewardsDistro,
      network: this.network,
    });

    const [pls, plsDpx, plsJones, jones] = await rewardsDistroContract.read.getEmissions();
    return pls > 0 || plsDpx > 0 || plsJones > 0 || jones > 0;
  }

  async getLabel({
    definition,
  }: GetDisplayPropsParams<PlutusFarmPlsJones, SingleStakingFarmDataProps, PlutusFarmDefinition>) {
    return definition.label;
  }

  async getStakedTokenBalance({ contract, address }: GetTokenBalancesParams<PlutusFarmPlsJones>) {
    return contract.read.userInfo([address]).then(v => v[0]);
  }

  async getRewardTokenBalances({ contract, address }: GetTokenBalancesParams<PlutusFarmPlsJones>) {
    return contract.read.pendingRewards([address]).then(v => [...v]);
  }
}
