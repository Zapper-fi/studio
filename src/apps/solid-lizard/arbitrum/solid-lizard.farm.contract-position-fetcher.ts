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
import { SolidLizardViemContractFactory } from '../contracts';
import { SolidLizardGauge } from '../contracts/viem';

@PositionTemplate()
export class ArbitrumSolidLizardStakingContractPositionFetcher extends SingleStakingFarmDynamicTemplateContractPositionFetcher<SolidLizardGauge> {
  groupLabel = 'Staking';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SolidLizardViemContractFactory) protected readonly contractFactory: SolidLizardViemContractFactory,
    @Inject(SolidLizardDefinitionsResolver) protected readonly definitionsResolver: SolidLizardDefinitionsResolver,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.solidLizardGauge({ address, network: this.network });
  }

  async getFarmAddresses() {
    return this.definitionsResolver.getFarmAddresses();
  }

  async getStakedTokenAddress({ contract }: GetTokenDefinitionsParams<SolidLizardGauge>) {
    return contract.read.underlying();
  }

  async getRewardTokenAddresses({ contract }: GetTokenDefinitionsParams<SolidLizardGauge>) {
    const numRewards = Number(await contract.read.rewardTokensLength());
    return Promise.all(range(numRewards).map(async n => await contract.read.rewardTokens([BigInt(n)])));
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
    const balance = await contract.read.balanceOf([address]);
    return balance;
  }

  getRewardTokenBalances({
    address,
    contract,
    contractPosition,
  }: GetTokenBalancesParams<SolidLizardGauge, SingleStakingFarmDataProps>) {
    const rewardTokens = contractPosition.tokens.filter(isClaimable);
    return Promise.all(rewardTokens.map(rt => contract.read.earned([rt.address, address])));
  }
}
