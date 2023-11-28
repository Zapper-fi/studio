import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { YearnViemContractFactory } from '../contracts';
import { YearnStakingReward } from '../contracts/viem';

@PositionTemplate()
export class EthereumYearnStakingRewardContractPositionFetcher extends ContractPositionTemplatePositionFetcher<YearnStakingReward> {
  groupLabel = 'Staking Reward';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(YearnViemContractFactory) protected readonly contractFactory: YearnViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.yearnStakingReward({ address, network: this.network });
  }

  async getDefinitions() {
    return [
      { address: '0x774a55c3eeb79929fd445ae97191228ab39c4d0f' },
      { address: '0x84c94d739e075b3c7431bdb1a005f0412df828a5' },
      { address: '0x6806d62aadf2ee97cd4bce46bf5fcd89766ef246' },
      { address: '0x93283184650f4d3b4253abd00978176732118428' },
    ];
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<YearnStakingReward>) {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: await contract.read.stakingToken(),
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: await contract.read.rewardsToken(),
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<YearnStakingReward>) {
    return getLabelFromToken(contractPosition.tokens[0]);
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<YearnStakingReward>) {
    const [supplied, claimable] = await Promise.all([
      contract.read.balanceOf([address]),
      contract.read.earned([address]),
    ]);

    return [supplied, claimable];
  }
}
