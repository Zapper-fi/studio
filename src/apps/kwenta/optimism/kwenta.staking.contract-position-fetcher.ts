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

import { KwentaViemContractFactory } from '../contracts';
import { KwentaStaking } from '../contracts/viem';

const FARMS = [
  {
    address: '0x6e56a5d49f775ba08041e28030bc7826b13489e0',
    stakedTokenAddress: '0x920cf626a271321c151d027030d5d08af699456b', // Kwenta
    rewardTokenAddresses: ['0x920cf626a271321c151d027030d5d08af699456b'], // Kwenta
  },
  {
    address: '0x6077987e8e06c062094c33177eb12c4a65f90b65',
    stakedTokenAddress: '0x56dea47c40877c2aac2a689ac56aa56cae4938d2', // Kwenta/WETH Arrakis vault token
    rewardTokenAddresses: ['0x920cf626a271321c151d027030d5d08af699456b'], // Kwenta
  },
];

@PositionTemplate()
export class OptimismKwentaStakingContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<KwentaStaking> {
  groupLabel = 'Staking';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(KwentaViemContractFactory) protected readonly contractFactory: KwentaViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.kwentaStaking({ address, network: this.network });
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<KwentaStaking>) {
    const suppliedToken = contractPosition.tokens.find(isSupplied)!;
    return `Staked ${getLabelFromToken(suppliedToken)}`;
  }

  async getFarmDefinitions(): Promise<SingleStakingFarmDefinition[]> {
    return FARMS;
  }

  getRewardRates({ contract }: GetDataPropsParams<KwentaStaking, SingleStakingFarmDataProps>) {
    return contract.read.rewardRate();
  }

  getIsActive({ contract }: GetDataPropsParams<KwentaStaking>) {
    return contract.read.rewardRate().then(rate => rate > 0);
  }

  getStakedTokenBalance({ contract, address }: GetTokenBalancesParams<KwentaStaking, SingleStakingFarmDataProps>) {
    return contract.read.balanceOf([address]);
  }

  getRewardTokenBalances({ contract, address }: GetTokenBalancesParams<KwentaStaking, SingleStakingFarmDataProps>) {
    return contract.read.earned([address]);
  }
}
