import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  DefaultContractPositionDefinition,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { LyraAvalonContractFactory, LyraStkLyra } from '../contracts';

export abstract class LyraAvalonStkLyraClaimableContractPositionFetcher extends ContractPositionTemplatePositionFetcher<LyraStkLyra> {
  groupLabel = 'stkLYRA Rewards';

  abstract stkLyraContractAddress: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(LyraAvalonContractFactory) protected readonly contractFactory: LyraAvalonContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): LyraStkLyra {
    return this.contractFactory.lyraStkLyra({ address, network: this.network });
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    return [{ address: this.stkLyraContractAddress }];
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<LyraStkLyra>) {
    return [
      {
        metaType: MetaType.CLAIMABLE,
        address: await contract.STAKED_TOKEN(),
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<LyraStkLyra>) {
    return `Claimable ${getLabelFromToken(contractPosition.tokens[0])}`;
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<LyraStkLyra>) {
    const rewardBalance = await contract.getTotalRewardsBalance(address);
    return [rewardBalance];
  }
}
