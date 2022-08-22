import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { Register } from '~app-toolkit/decorators';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import {
  ContractPositionTemplatePositionFetcher,
  DefaultContractPositionDescriptor,
  DisplayPropsStageParams,
  GetTokenBalancesPerPositionParams,
} from '~position/template/contract-position.template.position-fetcher';
import { Network } from '~types';

import { LiquityContractFactory, StabilityPool } from '../contracts';
import LIQUITY_DEFINITION from '../liquity.definition';

const appId = LIQUITY_DEFINITION.id;
const groupId = LIQUITY_DEFINITION.groups.stabilityPool.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumLiquityStabilityPoolContractPositionFetcher extends ContractPositionTemplatePositionFetcher<StabilityPool> {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'Stability Pool';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(LiquityContractFactory) protected readonly contractFactory: LiquityContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): StabilityPool {
    return this.contractFactory.stabilityPool({ address, network: this.network });
  }

  async getDescriptors(): Promise<DefaultContractPositionDescriptor[]> {
    return [{ address: '0x66017d22b0f8556afdd19fc67041899eb65a21bb' }];
  }

  async getTokenDescriptors() {
    return [
      { metaType: MetaType.SUPPLIED, address: '0x5f98805a4e8be255a32880fdec7f6728c6568ba0' }, // LUSD
      { metaType: MetaType.CLAIMABLE, address: ZERO_ADDRESS }, // ETH
      { metaType: MetaType.CLAIMABLE, address: '0x6dea81c8171d0ba574754ef6f8b412f2ed88c54d' }, // LQTY
    ];
  }

  async getLabel({ contractPosition }: DisplayPropsStageParams<StabilityPool>): Promise<string> {
    return `${getLabelFromToken(contractPosition.tokens[0])} Stability Pool`;
  }

  getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesPerPositionParams<StabilityPool>) {
    return Promise.all([
      contract.getCompoundedLUSDDeposit(address),
      contract.getDepositorETHGain(address),
      contract.getDepositorLQTYGain(address),
    ]);
  }
}
