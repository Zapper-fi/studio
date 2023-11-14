import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  GetDataPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';
import { SingleStakingFarmDynamicTemplateContractPositionFetcher } from '~position/template/single-staking.dynamic.template.contract-position-fetcher';

import { SteakHutViemContractFactory } from '../contracts';
import { SteakHutStaking } from '../contracts/viem';

@PositionTemplate()
export class AvalancheSteakHutStakingContractPositionFetcher extends SingleStakingFarmDynamicTemplateContractPositionFetcher<SteakHutStaking> {
  groupLabel = 'Staking';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SteakHutViemContractFactory) protected readonly contractFactory: SteakHutViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.steakHutStaking({ address, network: this.network });
  }

  getFarmAddresses() {
    return ['0x4e664284b7fbd10633768d59c17d959d9cb8dee2', '0x1f6866e1a684247886545503f8e6e76e328ade34'];
  }

  async getStakedTokenAddress({ contract }: GetTokenDefinitionsParams<SteakHutStaking>) {
    return contract.read.inputToken();
  }

  async getRewardTokenAddresses({ contract }: GetTokenDefinitionsParams<SteakHutStaking>) {
    return contract.read.rewardToken();
  }

  getRewardRates({ contract }: GetDataPropsParams<SteakHutStaking>) {
    return contract.read.tokenPerSec();
  }

  getStakedTokenBalance({ address, contract }: GetTokenBalancesParams<SteakHutStaking>) {
    return contract.read.userInfo([address]).then(v => v[0]);
  }

  getRewardTokenBalances({ address, contract }: GetTokenBalancesParams<SteakHutStaking>) {
    return contract.read.pendingTokens([address]);
  }
}
