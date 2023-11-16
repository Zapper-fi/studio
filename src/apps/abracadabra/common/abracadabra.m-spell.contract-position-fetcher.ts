import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { GetTokenBalancesParams, GetTokenDefinitionsParams } from '~position/template/contract-position.template.types';
import {
  SingleStakingFarmDataProps,
  SingleStakingFarmDynamicTemplateContractPositionFetcher,
} from '~position/template/single-staking.dynamic.template.contract-position-fetcher';

import { AbracadabraViemContractFactory } from '../contracts';
import { AbracadabraMspell } from '../contracts/viem';

export abstract class AbracadabraMspellContractPositionFetcher extends SingleStakingFarmDynamicTemplateContractPositionFetcher<AbracadabraMspell> {
  abstract mSpellAddress: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AbracadabraViemContractFactory) protected readonly contractFactory: AbracadabraViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.abracadabraMspell({ address, network: this.network });
  }

  async getFarmAddresses() {
    return [this.mSpellAddress];
  }

  async getStakedTokenAddress({ contract }: GetTokenDefinitionsParams<AbracadabraMspell>) {
    return contract.read.spell();
  }

  async getRewardTokenAddresses({ contract }: GetTokenDefinitionsParams<AbracadabraMspell>) {
    return contract.read.mim();
  }

  async getRewardRates() {
    return [0];
  }

  getStakedTokenBalance({ address, contract }: GetTokenBalancesParams<AbracadabraMspell, SingleStakingFarmDataProps>) {
    return contract.read.userInfo([address]).then(v => v[0]);
  }

  getRewardTokenBalances({ address, contract }: GetTokenBalancesParams<AbracadabraMspell, SingleStakingFarmDataProps>) {
    return contract.read.pendingReward([address]);
  }
}
