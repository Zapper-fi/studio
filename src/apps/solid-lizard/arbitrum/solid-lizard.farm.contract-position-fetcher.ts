import { Inject } from '@nestjs/common';
import { range } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { isClaimable } from '~position/position.utils';
import {
  GetTokenDefinitionsParams,
  GetDataPropsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';
import {
  SingleStakingFarmDataProps,
  SingleStakingFarmDynamicTemplateContractPositionFetcher,
} from '~position/template/single-staking.dynamic.template.contract-position-fetcher';

import { SolidLizardDefinitionsResolver } from '../common/solid-lizard.definitions-resolver';
import { SolidLizardContractFactory, SolidLizardGauge } from '../contracts';

@PositionTemplate()
export class ArbitrumSolidLizardStakingContractPositionFetcher extends SingleStakingFarmDynamicTemplateContractPositionFetcher<SolidLizardGauge> {
  groupLabel = 'Staking';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SolidLizardContractFactory) protected readonly contractFactory: SolidLizardContractFactory,
    @Inject(SolidLizardDefinitionsResolver) protected readonly definitionsResolver: SolidLizardDefinitionsResolver,
  ) {
    super(appToolkit);
  }

  getContract(address: string): SolidLizardGauge {
    return this.contractFactory.solidLizardGauge({ address, network: this.network });
  }

  async getFarmAddresses() {
    return this.definitionsResolver.getFarmAddresses();
  }

  async getStakedTokenAddress({ contract }: GetTokenDefinitionsParams<SolidLizardGauge>) {
    return contract.underlying();
  }

  async getRewardTokenAddresses({ contract }: GetTokenDefinitionsParams<SolidLizardGauge>) {
    const numRewards = Number(await contract.rewardTokensLength());
    return Promise.all(range(numRewards).map(async n => await contract.rewardTokens(n)));
  }

  // @TODO: Find rewards rates which matches the APY returned from their API
  getRewardRates({ contractPosition }: GetDataPropsParams<SolidLizardGauge, SingleStakingFarmDataProps>) {
    const rewardTokens = contractPosition.tokens.filter(isClaimable);
    return Promise.all(rewardTokens.map(_rt => 0));
  }

  async getStakedTokenBalance({
    address,
    contract,
  }: GetTokenBalancesParams<SolidLizardGauge, SingleStakingFarmDataProps>) {
    const balance = await contract.balanceOf(address);
    return balance;
  }

  getRewardTokenBalances({
    address,
    contract,
    contractPosition,
  }: GetTokenBalancesParams<SolidLizardGauge, SingleStakingFarmDataProps>) {
    const rewardTokens = contractPosition.tokens.filter(isClaimable);
    return Promise.all(rewardTokens.map(rt => contract.earned(rt.address, address)));
  }
}
