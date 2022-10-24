import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetDataPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import {
  SingleStakingFarmDataProps,
  SingleStakingFarmDefinition,
  SingleStakingFarmTemplateContractPositionFetcher,
} from '~position/template/single-staking.template.contract-position-fetcher';

import { PlutusContractFactory, PlutusFarmPlsJonesLp } from '../contracts';

@PositionTemplate()
export class ArbitrumPlutusFarmPlsJonesLpContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<PlutusFarmPlsJonesLp> {
  groupLabel = 'plsJONES LP Farm';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PlutusContractFactory) protected readonly contractFactory: PlutusContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): PlutusFarmPlsJonesLp {
    return this.contractFactory.plutusFarmPlsJonesLp({ address, network: this.network });
  }

  async getFarmDefinitions(): Promise<SingleStakingFarmDefinition[]> {
    return [
      {
        address: '0xb059fc19371691aa7a3ec66dd80684ffe17a7d5c',
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

  async getActivePeriod({ contract }: GetDataPropsParams<PlutusFarmPlsJonesLp>): Promise<boolean> {
    return contract.paused();
  }

  async getStakedTokenBalance({ contract, address }: GetTokenBalancesParams<PlutusFarmPlsJonesLp>) {
    return contract.userInfo(address).then(v => v.amount);
  }

  async getRewardTokenBalances({ contract, address }: GetTokenBalancesParams<PlutusFarmPlsJonesLp>) {
    return contract.pendingRewards(address);
  }
}
