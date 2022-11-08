import { Inject, Injectable } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { GetTokenBalancesParams, GetTokenDefinitionsParams } from '~position/template/contract-position.template.types';
import { VotingEscrowTemplateContractPositionFetcher } from '~position/template/voting-escrow.template.contract-position-fetcher';
import { Network } from '~types';

import { QiDaoContractFactory, QiDaoEscrowedQi } from '../contracts';
import { QI_DAO_DEFINITION } from '../qi-dao.definition';

@Injectable()
export class PolygonQiDaoEscrowedQiContractPositionFetcher extends VotingEscrowTemplateContractPositionFetcher<QiDaoEscrowedQi> {
  appId = QI_DAO_DEFINITION.id;
  groupId = QI_DAO_DEFINITION.groups.escrowedQi.id;
  network = Network.POLYGON_MAINNET;
  groupLabel = 'Escrowed QI';
  veTokenAddress = '0x880decade22ad9c58a8a4202ef143c4f305100b3';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(QiDaoContractFactory) protected readonly contractFactory: QiDaoContractFactory,
  ) {
    super(appToolkit);
  }

  getEscrowContract(address: string): QiDaoEscrowedQi {
    return this.contractFactory.qiDaoEscrowedQi({ address, network: this.network });
  }

  async getEscrowedTokenAddress({ contract }: GetTokenDefinitionsParams<QiDaoEscrowedQi>) {
    return contract.Qi();
  }

  async getEscrowedTokenBalance({ address, contract }: GetTokenBalancesParams<QiDaoEscrowedQi>) {
    return contract.userInfo(address).then(v => v.amount);
  }
}
