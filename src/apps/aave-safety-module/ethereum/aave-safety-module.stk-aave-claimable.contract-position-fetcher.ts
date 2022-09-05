import { Inject, Injectable } from '@nestjs/common';

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
import { Network } from '~types';

import { AAVE_SAFETY_MODULE_DEFINITION } from '../aave-safety-module.definition';
import { AaveSafetyModuleContractFactory, AaveStkAave } from '../contracts';

@Injectable()
export class EthereumAaveSafetyModuleStkAaveClaimableContractPositionFetcher extends ContractPositionTemplatePositionFetcher<AaveStkAave> {
  appId = AAVE_SAFETY_MODULE_DEFINITION.id;
  groupId = AAVE_SAFETY_MODULE_DEFINITION.groups.stkAaveClaimable.id;
  network = Network.ETHEREUM_MAINNET;
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
