import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetDataPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';
import { SingleStakingFarmTemplateContractPositionFetcher } from '~position/template/single-staking.template.contract-position-fetcher';

import { SaddleCommunalFarm, SaddleContractFactory } from '../contracts';

const FARMS = [
  // Saddle D4 Communal Farm
  {
    address: '0x0639076265e9f88542c91dcdeda65127974a5ca5',
    stakedTokenAddress: '0xd48cf4d7fb0824cc8bae055df3092584d0a1726a',
    rewardTokenAddresses: [
      '0x3432b6a60d23ca0dfca7761b7ab56459d9c964d0',
      '0xc7283b66eb1eb5fb86327f08e1b5816b0720212b',
      '0xdbdb4d16eda451d0503b854cf79d55697f90c8df',
      '0x6dea81c8171d0ba574754ef6f8b412f2ed88c54d',
    ],
  },
];

@PositionTemplate()
export class EthereumSaddleCommunalFarmContractPositionFetcher extends SingleStakingFarmTemplateContractPositionFetcher<SaddleCommunalFarm> {
  groupLabel = 'Communal Farms';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SaddleContractFactory) protected readonly contractFactory: SaddleContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): SaddleCommunalFarm {
    return this.contractFactory.saddleCommunalFarm({ address, network: this.network });
  }

  async getFarmDefinitions() {
    return FARMS;
  }

  async getRewardRates({ contract }: GetDataPropsParams<SaddleCommunalFarm>) {
    return Promise.all([
      contract.rewardRates(0),
      contract.rewardRates(1),
      contract.rewardRates(2),
      contract.rewardRates(3),
    ]);
  }

  async getIsActive({ contract }: GetDataPropsParams<SaddleCommunalFarm>): Promise<boolean> {
    const rewardRates = await Promise.all([
      contract.rewardRates(0),
      contract.rewardRates(1),
      contract.rewardRates(2),
      contract.rewardRates(3),
    ]);

    return rewardRates.some(rate => rate.gt(0));
  }

  async getStakedTokenBalance({ address, contract }: GetTokenBalancesParams<SaddleCommunalFarm>) {
    return contract.lockedLiquidityOf(address);
  }

  async getRewardTokenBalances({ address, contract }: GetTokenBalancesParams<SaddleCommunalFarm>) {
    return contract.earned(address);
  }
}
