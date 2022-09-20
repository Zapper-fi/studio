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

import { AaveSafetyModuleContractFactory, AaveStkAave } from '../contracts';

@PositionTemplate()
export class EthereumAaveSafetyModuleStkAaveClaimableContractPositionFetcher extends ContractPositionTemplatePositionFetcher<AaveStkAave> {
  groupLabel = 'stkAAVE Rewards';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AaveSafetyModuleContractFactory) protected readonly contractFactory: AaveSafetyModuleContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): AaveStkAave {
    return this.contractFactory.aaveStkAave({ address, network: this.network });
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    return [{ address: '0x4da27a545c0c5b758a6ba100e3a049001de870f5' }];
  }

  async getTokenDefinitions(_params: GetTokenDefinitionsParams<AaveStkAave>) {
    return [{ metaType: MetaType.CLAIMABLE, address: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9' }];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<AaveStkAave>) {
    return `Claimable ${getLabelFromToken(contractPosition.tokens[0])}`;
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<AaveStkAave>) {
    const rewardBalance = await contract.getTotalRewardsBalance(address);
    return [rewardBalance];
  }
}
