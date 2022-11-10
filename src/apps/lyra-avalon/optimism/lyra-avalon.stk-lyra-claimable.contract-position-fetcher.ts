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

import { LyraAvalonContractFactory, LyraStkLyra } from '../contracts';

@PositionTemplate()
export class OptimismLyraAvalonStkLyraClaimableContractPositionFetcher extends ContractPositionTemplatePositionFetcher<LyraStkLyra> {
  groupLabel = 'stkLYRA Rewards';

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
    return [{ address: '0xde48b1b5853cc63b1d05e507414d3e02831722f8' }];
  }

  async getTokenDefinitions(_params: GetTokenDefinitionsParams<LyraStkLyra>) {
    return [{ metaType: MetaType.CLAIMABLE, address: '0x50c5725949a6f0c72e6c4a641f24049a917db0cb' }];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<LyraStkLyra>) {
    return `Claimable ${getLabelFromToken(contractPosition.tokens[0])}`;
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<LyraStkLyra>) {
    const rewardBalance = await contract.getTotalRewardsBalance(address);
    return [rewardBalance];
  }
}
