import { Inject } from '@nestjs/common';
import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { CurveVotingEscrowContractPositionHelper } from '~apps/curve/helpers/curve.voting-escrow.contract-position-helper';
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
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(MahadaoContractFactory) private readonly mahadaoContractFactory: MahadaoContractFactory,
  ) { }

  async getPositions() {
    return this.curveVotingEscrowContractPositionHelper.getContractPositions<MahadoMahaxLocker>({
      votingEscrowAddress: '0xbdD8F4dAF71C2cB16ccE7e54BB81ef3cfcF5AAcb',
      appId: MAHADAO_DEFINITION.id,
      groupId: MAHADAO_DEFINITION.groups.locker.id,
      network,
      resolveContract: ({ address }) => this.mahadaoContractFactory.mahadoMahaxLocker({ network, address }),
      resolveLockedTokenAddress: () => Promise.resolve("0xB4d930279552397bbA2ee473229f89Ec245bc365"),
    });
  }
}
