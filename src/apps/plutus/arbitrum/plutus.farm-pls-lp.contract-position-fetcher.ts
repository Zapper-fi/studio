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

import { PlutusContractFactory, PlutusFarmPlsJonesLp } from '../contracts';

export type PlutusFarmDefinition = SingleStakingFarmDefinition & {
  label: string;
};

@PositionTemplate()
export class ArbitrumPlutusFarmPlsLpContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<
  PlutusFarmPlsJonesLp,
  SingleStakingFarmDataProps,
  PlutusFarmDefinition
> {
  groupLabel = 'Farms';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PlutusContractFactory) protected readonly contractFactory: PlutusContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): PlutusFarmPlsJonesLp {
    return this.contractFactory.plutusFarmPlsJonesLp({ address, network: this.network });
  }

  async getFarmDefinitions(): Promise<PlutusFarmDefinition[]> {
    return [
      {
        address: '0xa61f0d1d831ba4be2ae253c13ff906d9463299c2',
        label: 'plsDPX',
        stakedTokenAddress: '0x16e818e279d7a12ff897e257b397172dcaab323b',
        rewardTokenAddresses: [
          '0x51318b7d00db7acc4026c88c3952b66278b6a67f', // PLS
        ],
      },
      {
        address: '0x4e5cf54fde5e1237e80e87fcba555d829e1307ce',
        label: 'plvGLP',
        stakedTokenAddress: '0x5326e71ff593ecc2cf7acae5fe57582d6e74cff1',
        rewardTokenAddresses: [
          '0x51318b7d00db7acc4026c88c3952b66278b6a67f', // PLS
        ],
      },
      {
        address: '0xb059fc19371691aa7a3ec66dd80684ffe17a7d5c',
        label: 'plvGLP',
        stakedTokenAddress: '0x69fdf3b2e3784a315e2885a19d3565c4398d49a5',
        rewardTokenAddresses: [
          '0x51318b7d00db7acc4026c88c3952b66278b6a67f', // PLS
        ],
      },
    ];
  }

  getRewardRates({ contract }: GetDataPropsParams<PlutusFarmPlsJonesLp, SingleStakingFarmDataProps>) {
    return contract.plsPerSecond();
  }

  async getIsActive({ contract }: GetDataPropsParams<PlutusFarmPlsJonesLp>) {
    return contract.plsPerSecond().then(v => v.gt(0));
  }

  async getLabel({
    definition,
  }: GetDisplayPropsParams<PlutusFarmPlsJonesLp, SingleStakingFarmDataProps, PlutusFarmDefinition>) {
    return definition.label;
  }

  async getStakedTokenBalance({ contract, address }: GetTokenBalancesParams<PlutusFarmPlsJonesLp>) {
    return contract.userInfo(address).then(v => v.amount);
  }

  async getRewardTokenBalances({ contract, address }: GetTokenBalancesParams<PlutusFarmPlsJonesLp>) {
    return contract.pendingRewards(address);
  }
}
