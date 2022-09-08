import { Inject, Injectable } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  DefaultContractPositionDefinition,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';
import { Network } from '~types';

import { LiquityContractFactory, TroveManager } from '../contracts';
import LIQUITY_DEFINITION from '../liquity.definition';

@Injectable()
export class EthereumLiquityTroveContractPositionFetcher extends ContractPositionTemplatePositionFetcher<TroveManager> {
  appId = LIQUITY_DEFINITION.id;
  groupId = LIQUITY_DEFINITION.groups.trove.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'Trove';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(LiquityContractFactory) protected readonly contractFactory: LiquityContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): TroveManager {
    return this.contractFactory.troveManager({ address, network: this.network });
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    return [{ address: '0xa39739ef8b0231dbfa0dcda07d7e29faabcf4bb2' }];
  }

  async getTokenDefinitions() {
    return [
      { metaType: MetaType.SUPPLIED, address: ZERO_ADDRESS }, // ETH
      { metaType: MetaType.BORROWED, address: '0x5f98805a4e8be255a32880fdec7f6728c6568ba0' }, // LUSD
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<TroveManager>): Promise<string> {
    return `${getLabelFromToken(contractPosition.tokens[0])} Trove`;
  }

  getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<TroveManager>) {
    return Promise.all([contract.getTroveColl(address), contract.getTroveDebt(address)]);
  }
}
