import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { GetDisplayPropsParams, GetTokenBalancesParams } from '~position/template/contract-position.template.types';

import { AaveSafetyModuleContractFactory, AaveStkAbpt } from '../contracts';

@PositionTemplate()
export class EthereumAaveSafetyModuleStkAbptClaimableContractPositionFetcher extends ContractPositionTemplatePositionFetcher<AaveStkAbpt> {
  groupLabel = 'stkABPT Rewards';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AaveSafetyModuleContractFactory) protected readonly contractFactory: AaveSafetyModuleContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): AaveStkAbpt {
    return this.contractFactory.aaveStkAbpt({ address, network: this.network });
  }

  async getDefinitions() {
    return [{ address: '0xa1116930326d21fb917d5a27f1e9943a9595fb47' }];
  }

  async getTokenDefinitions() {
    return [{ metaType: MetaType.CLAIMABLE, address: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9' }];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<AaveStkAbpt>) {
    return `Claimable ${getLabelFromToken(contractPosition.tokens[0])}`;
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<AaveStkAbpt>) {
    const rewardBalance = await contract.getTotalRewardsBalance(address);
    return [rewardBalance];
  }
}
