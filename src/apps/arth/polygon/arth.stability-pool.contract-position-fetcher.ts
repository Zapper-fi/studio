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
const network = Network.POLYGON_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class PolygonArthStabilityPoolContractPositionFetcher extends ContractPositionTemplatePositionFetcher<StabilityPool> {
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
    return [{ address: '0x9209757ec192caa894ad8ebc393deb95b2ed5d0a' }];
  }

  async getTokenDescriptors() {
    return [
      { metaType: MetaType.SUPPLIED, address: '0x862fc9f243365d98ed9ff68f720041074299b0dc' }, // ARTH
      { metaType: MetaType.CLAIMABLE, address: ZERO_ADDRESS }, // MATIC
      { metaType: MetaType.CLAIMABLE, address: '0xedd6ca8a4202d4a36611e2fff109648c4863ae19' }, // MAHA
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
