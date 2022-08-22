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

import { TeddyCashContractFactory } from '../contracts';
import { TeddyCashStabilityPool } from '../contracts/ethers';
import { TEDDY_CASH_DEFINITION } from '../teddy-cash.definition';

const appId = TEDDY_CASH_DEFINITION.id;
const groupId = TEDDY_CASH_DEFINITION.groups.stabilityPool.id;
const network = Network.AVALANCHE_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class AvalancheTeddyCashStabilityPoolContractPositionFetcher extends ContractPositionTemplatePositionFetcher<TeddyCashStabilityPool> {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'Stability Pool';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(TeddyCashContractFactory) protected readonly contractFactory: TeddyCashContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): TeddyCashStabilityPool {
    return this.contractFactory.teddyCashStabilityPool({ address, network: this.network });
  }

  async getDescriptors(): Promise<DefaultContractPositionDescriptor[]> {
    return [{ address: '0x7aed63385c03dc8ed2133f705bbb63e8ea607522' }];
  }

  async getTokenDescriptors() {
    return [
      { metaType: MetaType.SUPPLIED, address: '0x4fbf0429599460d327bd5f55625e30e4fc066095' }, // TSD
      { metaType: MetaType.CLAIMABLE, address: ZERO_ADDRESS }, // AVAX
      { metaType: MetaType.CLAIMABLE, address: '0x094bd7b2d99711a1486fb94d4395801c6d0fddcc' }, // TEDDY
    ];
  }

  async getLabel({ contractPosition }: DisplayPropsStageParams<TeddyCashStabilityPool>): Promise<string> {
    return `${getLabelFromToken(contractPosition.tokens[0])} Stability Pool`;
  }

  getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesPerPositionParams<TeddyCashStabilityPool>) {
    return Promise.all([
      contract.getCompoundedLUSDDeposit(address),
      contract.getDepositorETHGain(address),
      contract.getDepositorLQTYGain(address),
    ]);
  }
}
