import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { CurveVotingEscrowContractPositionHelper } from '~apps/curve/helpers/curve.voting-escrow.contract-position-helper';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import BLUEBIT_DEFINITION from '../bluebit.definition';
import { BluebitContractFactory } from '../contracts';
import { BluebitVeToken } from '../contracts/ethers/BluebitVeToken';

const appId = BLUEBIT_DEFINITION.id;
const groupId = BLUEBIT_DEFINITION.groups.votingEscrow.id;
const network = Network.AURORA_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class AuroraBluebitVotingEscrowContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(CurveVotingEscrowContractPositionHelper)
    private readonly curveVotingEscrowContractPositionHelper: CurveVotingEscrowContractPositionHelper,
    @Inject(BluebitContractFactory)
    private readonly bluebitContractFactory: BluebitContractFactory,
  ) {}

  async getPositions() {
    return this.curveVotingEscrowContractPositionHelper.getContractPositions<BluebitVeToken>({
      votingEscrowAddress: '0xdf7c547f332351a86db0d89a89799a7ab4ec9deb',
      appId: BLUEBIT_DEFINITION.id,
      groupId: BLUEBIT_DEFINITION.groups.votingEscrow.id,
      network,
      resolveContract: ({ address }) => this.bluebitContractFactory.bluebitVeToken({ network, address }),
      resolveLockedTokenAddress: ({ contract, multicall }) => multicall.wrap(contract).token(),
    });
  }
}
