import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { CurveVotingEscrowContractPositionHelper } from '~apps/curve/helpers/curve.voting-escrow.contract-position-helper';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MahadaoContractFactory, MahadoMahaxLocker } from '../contracts';
import { MAHADAO_DEFINITION } from '../mahadao.definition';

const appId = MAHADAO_DEFINITION.id;
const groupId = MAHADAO_DEFINITION.groups.locker.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumMahadaoLockerContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(CurveVotingEscrowContractPositionHelper)
    private readonly curveVotingEscrowContractPositionHelper: CurveVotingEscrowContractPositionHelper,
    @Inject(MahadaoContractFactory) private readonly mahadaoContractFactory: MahadaoContractFactory,
  ) {}

  async getPositions() {
    return this.curveVotingEscrowContractPositionHelper.getContractPositions<MahadoMahaxLocker>({
      votingEscrowAddress: '0xbdd8f4daf71c2cb16cce7e54bb81ef3cfcf5aacb',
      appId,
      groupId,
      network,
      resolveContract: ({ address }) => this.mahadaoContractFactory.mahadoMahaxLocker({ network, address }),
      resolveLockedTokenAddress: () => Promise.resolve('0xb4d930279552397bba2ee473229f89ec245bc365'),
    });
  }
}
