import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetTokenBalancesParams, GetTokenDefinitionsParams } from '~position/template/contract-position.template.types';
import { VotingEscrowTemplateContractPositionFetcher } from '~position/template/voting-escrow.template.contract-position-fetcher';

import { QiDaoViemContractFactory } from '../contracts';
import { QiDaoEscrowedQi } from '../contracts/viem';
import { QiDaoEscrowedQiContract } from '../contracts/viem/QiDaoEscrowedQi';

@PositionTemplate()
export class PolygonQiDaoEscrowedQiContractPositionFetcher extends VotingEscrowTemplateContractPositionFetcher<QiDaoEscrowedQi> {
  groupLabel = 'Escrowed QI';
  veTokenAddress = '0x880decade22ad9c58a8a4202ef143c4f305100b3';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(QiDaoViemContractFactory) protected readonly contractFactory: QiDaoViemContractFactory,
  ) {
    super(appToolkit);
  }

  getEscrowContract(address: string): QiDaoEscrowedQiContract {
    return this.contractFactory.qiDaoEscrowedQi({ address, network: this.network });
  }

  async getEscrowedTokenAddress({ contract }: GetTokenDefinitionsParams<QiDaoEscrowedQi>) {
    return contract.read.Qi();
  }

  async getEscrowedTokenBalance({ address, contract }: GetTokenBalancesParams<QiDaoEscrowedQi>) {
    return contract.read.userInfo([address]).then(v => v[0]);
  }
}
