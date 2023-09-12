import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import {
  SingleStakingFarmDataProps,
  SingleStakingFarmDefinition,
  SingleStakingFarmTemplateContractPositionFetcher,
} from '~position/template/single-staking.template.contract-position-fetcher';

import { TokemakContractFactory, TokemakTokeStaking } from '../contracts';

const FARMS = [
  {
    address: '0x96f98ed74639689c3a11daf38ef86e59f43417d3',
    stakedTokenAddress: '0x2e9d63788249371f1dfc918a52f8d799f4a38c94',
    rewardTokenAddresses: ['0x2e9d63788249371f1dfc918a52f8d799f4a38c94'],
  },
];

@PositionTemplate()
export class EthereumTokemakFarmContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<TokemakTokeStaking> {
  groupLabel = 'Staking';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(TokemakContractFactory) private readonly contractFactory: TokemakContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): TokemakTokeStaking {
    return this.contractFactory.tokemakTokeStaking({ address, network: this.network });
  }

  async getFarmDefinitions(): Promise<SingleStakingFarmDefinition[]> {
    return FARMS;
  }

  async getRewardRates() {
    return 0;
  }

  async getIsActive() {
    return true;
  }

  getStakedTokenBalance({ address, contract }: GetTokenBalancesParams<TokemakTokeStaking, SingleStakingFarmDataProps>) {
    return contract.balanceOf(address);
  }

  async getRewardTokenBalances() {
    return 0;
  }
}
