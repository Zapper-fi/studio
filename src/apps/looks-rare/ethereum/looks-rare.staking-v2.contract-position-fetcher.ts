import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

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
import { LooksRareStakingRewardsV2 } from '../contracts/viem';

@PositionTemplate()
export class EthereumLooksRareStakingV2ContractPositionFetcher extends ContractPositionTemplatePositionFetcher<LooksRareStakingRewardsV2> {
  groupLabel = 'Staking V2';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(LooksRareViemContractFactory) protected readonly contractFactory: LooksRareViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.looksRareStakingRewardsV2({ address, network: this.network });
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    return [{ address: '0x0000000000017b2a2a6a336079abc67f6f48ab9a' }];
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<LooksRareStakingRewardsV2>) {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: await contract.read.stakingToken(),
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: await contract.read.rewardToken(),
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<LooksRareStakingRewardsV2>) {
    return getLabelFromToken(contractPosition.tokens[0]);
  }

  async getTokenBalancesPerPosition({
    address,
    contract,
  }: GetTokenBalancesParams<LooksRareStakingRewardsV2>): Promise<BigNumberish[]> {
    const [suppliedBalance, claimableBalance] = await Promise.all([
      contract.read.balanceOf([address]),
      contract.read.rewards([address]),
    ]);

    return [suppliedBalance, claimableBalance];
  }
}
