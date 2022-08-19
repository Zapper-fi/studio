import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { CurveVotingEscrowContractPositionHelper } from '~apps/curve';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { PickleContractFactory, PickleVotingEscrow, PickleVotingEscrowReward } from '../contracts';
import { PICKLE_DEFINITION } from '../pickle.definition';

const appId = PICKLE_DEFINITION.id;
const groupId = PICKLE_DEFINITION.groups.votingEscrow.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumPickleVotingEscrowContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(CurveVotingEscrowContractPositionHelper)
    private readonly curveVotingEscrowContractPositionHelper: CurveVotingEscrowContractPositionHelper,
    @Inject(PickleContractFactory)
    private readonly pickleContractFactory: PickleContractFactory,
  ) {}

  async getPositions() {
    return this.curveVotingEscrowContractPositionHelper.getContractPositions<
      PickleVotingEscrow,
      PickleVotingEscrowReward
    >({
      votingEscrowAddress: '0xbbcf169ee191a1ba7371f30a1c344bfc498b29cf',
      votingEscrowRewardAddress: '0x74c6cade3ef61d64dcc9b97490d9fbb231e4bdcc',
      appId: PICKLE_DEFINITION.id,
      groupId: PICKLE_DEFINITION.groups.votingEscrow.id,
      network,
      resolveContract: ({ address }) => this.pickleContractFactory.pickleVotingEscrow({ network, address }),
      resolveRewardContract: ({ address }) => this.pickleContractFactory.pickleVotingEscrowReward({ network, address }),
      resolveLockedTokenAddress: ({ contract, multicall }) => multicall.wrap(contract).token(),
      resolveRewardTokenAddress: ({ contract, multicall }) => multicall.wrap(contract).token(),
    });
  }
}
