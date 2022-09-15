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

import ARTH_DEFINITION from '../arth.definition';
import { ArthContractFactory, StabilityPool } from '../contracts';

const appId = ARTH_DEFINITION.id;
const groupId = ARTH_DEFINITION.groups.stabilityPool.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumArthStabilityPoolContractPositionFetcher extends ContractPositionTemplatePositionFetcher<StabilityPool> {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'Stability Pool';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ArthContractFactory) protected readonly contractFactory: ArthContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): StabilityPool {
    return this.contractFactory.stabilityPool({ address, network: this.network });
  }

  async getDescriptors(): Promise<DefaultContractPositionDescriptor[]> {
    return [{ address: '0x2c360b513ae52947eeb37cfad57ac9b7c9373e1b' }];
  }

  async getTokenDescriptors() {
    return [
      { metaType: MetaType.SUPPLIED, address: '0x8cc0f052fff7ead7f2edcccac895502e884a8a71' }, // ARTH
      { metaType: MetaType.CLAIMABLE, address: ZERO_ADDRESS }, // ETH
      { metaType: MetaType.CLAIMABLE, address: '0xb4d930279552397bba2ee473229f89ec245bc365' }, // MAHA
    ];
  }

  async getLabel({ contractPosition }: DisplayPropsStageParams<StabilityPool>): Promise<string> {
    return `${getLabelFromToken(contractPosition.tokens[0])} Stability Pool`;
  }

  getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesPerPositionParams<StabilityPool>) {
    return Promise.all([
      contract.getCompoundedARTHDeposit(address),
      contract.getDepositorETHGain(address),
      contract.getDepositorMAHAGain(address),
    ]);
  }
}
