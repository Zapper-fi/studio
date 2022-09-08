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
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumArthTroveContractPositionFetcher extends ContractPositionTemplatePositionFetcher<TroveManager> {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'Loan';

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
    return [{ address: '0xf4ed5d0c3c977b57382fabbea441a63faaf843d3' }];
  }

  async getTokenDescriptors() {
    return [
      { metaType: MetaType.SUPPLIED, address: ZERO_ADDRESS }, // ETH
      { metaType: MetaType.BORROWED, address: '0x8cc0f052fff7ead7f2edcccac895502e884a8a71' }, // ARTH
    ];
  }

  async getLabel({ contractPosition }: DisplayPropsStageParams<TroveManager>): Promise<string> {
    return `${getLabelFromToken(contractPosition.tokens[0])} Loan`;
  }

  getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesPerPositionParams<TroveManager>) {
    return Promise.all([contract.getTroveColl(address), contract.getTroveDebt(address)]);
  }
}
