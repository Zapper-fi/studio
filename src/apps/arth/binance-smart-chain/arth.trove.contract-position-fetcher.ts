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
import { ArthContractFactory, TroveManager } from '../contracts';

const appId = ARTH_DEFINITION.id;
const groupId = ARTH_DEFINITION.groups.trove.id;
const network = Network.BINANCE_SMART_CHAIN_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class BinanceSmartChainArthTroveContractPositionFetcher extends ContractPositionTemplatePositionFetcher<TroveManager> {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'Trove';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ArthContractFactory) protected readonly contractFactory: ArthContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): TroveManager {
    return this.contractFactory.troveManager({ address, network: this.network });
  }

  async getDescriptors(): Promise<DefaultContractPositionDescriptor[]> {
    return [{ address: '0x7efc97ea11bc03bf5abf4474cb614c409ef34957' }];
  }

  async getTokenDescriptors() {
    return [
      { metaType: MetaType.SUPPLIED, address: ZERO_ADDRESS }, // BNB
      { metaType: MetaType.BORROWED, address: '0x85dab10c3ba20148ca60c2eb955e1f8ffe9eaa79' }, // ARTH
    ];
  }

  async getLabel({ contractPosition }: DisplayPropsStageParams<TroveManager>): Promise<string> {
    return `${getLabelFromToken(contractPosition.tokens[0])} Trove`;
  }

  getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesPerPositionParams<TroveManager>) {
    return Promise.all([contract.getTroveColl(address), contract.getTroveDebt(address)]);
  }
}
