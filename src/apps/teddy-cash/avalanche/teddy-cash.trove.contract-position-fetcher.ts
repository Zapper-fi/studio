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

import { TeddyCashContractFactory, TeddyCashTroveManager } from '../contracts';
import { TEDDY_CASH_DEFINITION } from '../teddy-cash.definition';

const appId = TEDDY_CASH_DEFINITION.id;
const groupId = TEDDY_CASH_DEFINITION.groups.trove.id;
const network = Network.AVALANCHE_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class AvalancheTeddyCashTroveContractPositionFetcher extends ContractPositionTemplatePositionFetcher<TeddyCashTroveManager> {
  appId = appId;
  groupId = groupId;
  network = network;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(TeddyCashContractFactory) protected readonly contractFactory: TeddyCashContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): TeddyCashTroveManager {
    return this.contractFactory.teddyCashTroveManager({ address, network: this.network });
  }

  async getDescriptors(): Promise<DefaultContractPositionDescriptor[]> {
    return [{ address: '0xd22b04395705144fd12affd854248427a2776194' }];
  }

  async getTokenDescriptors() {
    return [
      { metaType: MetaType.SUPPLIED, address: ZERO_ADDRESS }, // AVAX
      { metaType: MetaType.BORROWED, address: '0x4fbf0429599460d327bd5f55625e30e4fc066095' }, // TSD
    ];
  }

  async getLabel({ contractPosition }: DisplayPropsStageParams<TeddyCashTroveManager>): Promise<string> {
    return `${getLabelFromToken(contractPosition.tokens[0])} Trove`;
  }

  getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesPerPositionParams<TeddyCashTroveManager>) {
    return Promise.all([contract.getTroveColl(address), contract.getTroveDebt(address)]);
  }
}
