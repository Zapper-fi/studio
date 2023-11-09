import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { isSupplied } from '~position/position.utils';
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

import { KwentaContractFactory, KwentaStakingV2 } from '../contracts';

const FARMS = [
  {
    address: '0x61294940ce7cd1bda10e349adc5b538b722ceb88',
    stakedTokenAddress: '0x920cf626a271321c151d027030d5d08af699456b', // Kwenta
    rewardTokenAddresses: ['0x920cf626a271321c151d027030d5d08af699456b'], // Kwenta
  },
];

@PositionTemplate()
export class OptimismKwentaStakingV2ContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<KwentaStakingV2> {
  groupLabel = 'Staking V2';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(KwentaViemContractFactory) protected readonly contractFactory: KwentaViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): KwentaStakingV2 {
    return this.contractFactory.kwentaStakingV2({ address, network: this.network });
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<KwentaStakingV2>) {
    const suppliedToken = contractPosition.tokens.find(isSupplied)!;
    return `Staked ${getLabelFromToken(suppliedToken)}`;
  }

  async getFarmDefinitions(): Promise<SingleStakingFarmDefinition[]> {
    return FARMS;
  }

  getRewardRates({ contract }: GetDataPropsParams<KwentaStakingV2, SingleStakingFarmDataProps>) {
    return contract.rewardRate();
  }

  getIsActive({ contract }: GetDataPropsParams<KwentaStakingV2>) {
    return contract.rewardRate().then(rate => rate.gt(0));
  }

  getStakedTokenBalance({ contract, address }: GetTokenBalancesParams<KwentaStakingV2, SingleStakingFarmDataProps>) {
    return contract.balanceOf(address);
  }

  getRewardTokenBalances({ contract, address }: GetTokenBalancesParams<KwentaStakingV2, SingleStakingFarmDataProps>) {
    return contract.earned(address);
  }
}
