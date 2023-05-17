import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { GetTokenBalancesParams } from '~position/template/contract-position.template.types';

import { CleverContractFactory, CleverLocker } from '../contracts';

import { CVX, CLEVCVX } from './addresses';

@PositionTemplate()
export class EthereumCleverLockContractPositionFetcher extends ContractPositionTemplatePositionFetcher<CleverLocker> {
  groupLabel = 'CLever';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CleverContractFactory) protected readonly contractFactory: CleverContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): CleverLocker {
    return this.contractFactory.cleverLocker({ address, network: this.network });
  }

  async getDefinitions() {
    return [{ address: '0x96c68d861ada016ed98c30c810879f9df7c64154' }];
  }

  async getTokenDefinitions() {
    return [
      {
        metaType: MetaType.LOCKED,
        address: CVX,
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: CVX,
        network: this.network,
      },
      {
        metaType: MetaType.BORROWED,
        address: CLEVCVX,
        network: this.network,
      },
    ];
  }

  async getLabel() {
    return `CVX Lock`;
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<CleverLocker>) {
    const userInfo = await contract.userInfo(address);
    return [userInfo.totalLocked, userInfo.totalUnlocked, userInfo.totalDebt];
  }
}
