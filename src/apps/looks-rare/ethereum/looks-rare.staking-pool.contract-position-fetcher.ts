import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  DefaultContractPositionDefinition,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { LooksRareViemContractFactory } from '../contracts';
import { LooksRareStakingPool } from '../contracts/viem';

@PositionTemplate()
export class EthereumLooksRareStakingPoolContractPositionFetcher extends ContractPositionTemplatePositionFetcher<LooksRareStakingPool> {
  groupLabel = 'Staking Pool';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(LooksRareViemContractFactory) protected readonly contractFactory: LooksRareViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.looksRareStakingPool({ address, network: this.network });
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    return [{ address: '0x2a70e7f51f6cd40c3e9956aa964137668cbfadc5' }];
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<LooksRareStakingPool>) {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: await contract.read.stakedToken(),
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: await contract.read.looksRareToken(),
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<LooksRareStakingPool>) {
    return getLabelFromToken(contractPosition.tokens[0]);
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<LooksRareStakingPool>) {
    const [balanceRaw, claimable] = await Promise.all([
      contract.read.userInfo([address]),
      contract.read.calculatePendingRewards([address]),
    ]);

    return [balanceRaw[0], claimable];
  }
}
