import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import {
  ContractPositionTemplatePositionFetcher,
  DisplayPropsStageParams,
  GetTokenBalancesPerPositionParams,
  TokenStageParams,
} from '~position/template/contract-position.template.position-fetcher';
import { Network } from '~types';

import { AAVE_SAFETY_MODULE_DEFINITION } from '../aave-safety-module.definition';
import { AaveSafetyModuleContractFactory, AaveStkAbpt } from '../contracts';

const appId = AAVE_SAFETY_MODULE_DEFINITION.id;
const groupId = AAVE_SAFETY_MODULE_DEFINITION.groups.stkAbptClaimable.id;
const network = Network.ARBITRUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumAaveSafetyModuleStkAbptClaimableContractPositionFetcher extends ContractPositionTemplatePositionFetcher<AaveStkAbpt> {
  appId = AAVE_SAFETY_MODULE_DEFINITION.id;
  groupId = AAVE_SAFETY_MODULE_DEFINITION.groups.stkAbptClaimable.id;
  network = Network.ARBITRUM_MAINNET;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AaveSafetyModuleContractFactory) protected readonly contractFactory: AaveSafetyModuleContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): AaveStkAbpt {
    return this.contractFactory.aaveStkAbpt({ address, network: this.network });
  }

  async getDescriptors() {
    return [{ address: '0xa1116930326d21fb917d5a27f1e9943a9595fb47' }];
  }

  async getTokenDescriptors(_params: TokenStageParams<AaveStkAbpt>) {
    return [{ metaType: MetaType.CLAIMABLE, address: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9' }];
  }

  async getLabel({ contractPosition }: DisplayPropsStageParams<AaveStkAbpt>) {
    return `Claimable ${getLabelFromToken(contractPosition.tokens[0])}`;
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesPerPositionParams<AaveStkAbpt>) {
    const rewardBalance = await contract.getTotalRewardsBalance(address);
    return [rewardBalance];
  }
}
