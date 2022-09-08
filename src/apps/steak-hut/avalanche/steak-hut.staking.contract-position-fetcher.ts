import { Inject, Injectable } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import {
  GetDataPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';
import { SingleStakingFarmDynamicTemplateContractPositionFetcher } from '~position/template/single-staking.dynamic.template.contract-position-fetcher';
import { Network } from '~types/network.interface';

import { SteakHutContractFactory, SteakHutStaking } from '../contracts';
import { STEAK_HUT_DEFINITION } from '../steak-hut.definition';

@Injectable()
export class AvalancheSteakHutStakingContractPositionFetcher extends SingleStakingFarmDynamicTemplateContractPositionFetcher<SteakHutStaking> {
  appId = STEAK_HUT_DEFINITION.id;
  groupId = STEAK_HUT_DEFINITION.groups.staking.id;
  network = Network.AVALANCHE_MAINNET;
  groupLabel = 'Staking';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SteakHutContractFactory) protected readonly contractFactory: SteakHutContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): SteakHutStaking {
    return this.contractFactory.steakHutStaking({ address, network: this.network });
  }

  getFarmAddresses() {
    return ['0x4e664284b7fbd10633768d59c17d959d9cb8dee2', '0x1f6866e1a684247886545503f8e6e76e328ade34'];
  }

  async getStakedTokenAddress({ contract }: GetTokenDefinitionsParams<SteakHutStaking>) {
    return contract.inputToken();
  }

  async getRewardTokenAddresses({ contract }: GetTokenDefinitionsParams<SteakHutStaking>) {
    return contract.rewardToken();
  }

  getRewardRates({ contract }: GetDataPropsParams<SteakHutStaking>) {
    return contract.tokenPerSec();
  }

  getStakedTokenBalance({ address, contract }: GetTokenBalancesParams<SteakHutStaking>) {
    return contract.userInfo(address).then(v => v.amount);
  }

  getRewardTokenBalances({ address, contract }: GetTokenBalancesParams<SteakHutStaking>) {
    return contract.pendingTokens(address);
  }
}
