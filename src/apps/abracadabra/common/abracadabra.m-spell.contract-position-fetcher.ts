import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import {
  GetTokenBalancesPerPositionParams,
  TokenStageParams,
} from '~position/template/contract-position.template.position-fetcher';
import {
  SingleStakingFarmDataProps,
  SingleStakingFarmDynamicTemplateContractPositionFetcher,
} from '~position/template/single-staking.dynamic.template.contract-position-fetcher';

import { AbracadabraContractFactory, AbracadabraMspell } from '../contracts';

export abstract class AbracadabraMspellContractPositionFetcher extends SingleStakingFarmDynamicTemplateContractPositionFetcher<AbracadabraMspell> {
  abstract mSpellAddress: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AbracadabraContractFactory) protected readonly contractFactory: AbracadabraContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): AbracadabraMspell {
    return this.contractFactory.abracadabraMspell({ address, network: this.network });
  }

  async getFarmAddresses() {
    return [this.mSpellAddress];
  }

  async getStakedTokenAddress({ contract }: TokenStageParams<AbracadabraMspell, SingleStakingFarmDataProps>) {
    return contract.spell();
  }

  async getRewardTokenAddresses({ contract }: TokenStageParams<AbracadabraMspell, SingleStakingFarmDataProps>) {
    return contract.mim();
  }

  async getRewardRates() {
    return [0];
  }

  getStakedTokenBalance({
    address,
    contract,
  }: GetTokenBalancesPerPositionParams<AbracadabraMspell, SingleStakingFarmDataProps>) {
    return contract.userInfo(address).then(v => v.amount);
  }

  getRewardTokenBalances({
    address,
    contract,
  }: GetTokenBalancesPerPositionParams<AbracadabraMspell, SingleStakingFarmDataProps>) {
    return contract.pendingReward(address);
  }
}
