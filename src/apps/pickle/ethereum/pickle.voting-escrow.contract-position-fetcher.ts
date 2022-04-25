import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { CurveVotingEscrow, CurveVotingEscrowContractPositionHelper, CurveVotingEscrowReward } from '~apps/curve';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { PICKLE_DEFINITION } from '../pickle.definition';

@Register.ContractPositionFetcher({
  appId: PICKLE_DEFINITION.id,
  groupId: PICKLE_DEFINITION.groups.votingEscrow.id,
  network: Network.ETHEREUM_MAINNET,
})
export class EthereumPickleVotingEscrowContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(CurveVotingEscrowContractPositionHelper)
    private readonly curveVotingEscrowContractPositionHelper: CurveVotingEscrowContractPositionHelper,
  ) {}

  async getPositions() {
    const network = Network.ETHEREUM_MAINNET;
    return this.curveVotingEscrowContractPositionHelper.getContractPositions<
      CurveVotingEscrow,
      CurveVotingEscrowReward
    >({
      votingEscrowAddress: '0xbbcf169ee191a1ba7371f30a1c344bfc498b29cf',
      votingEscrowRewardAddress: '0x74c6cade3ef61d64dcc9b97490d9fbb231e4bdcc',
      appId: PICKLE_DEFINITION.id,
      groupId: PICKLE_DEFINITION.groups.votingEscrow.id,
      network,
      resolveContract: ({ contractFactory, address }) => contractFactory.curveVotingEscrow({ network, address }),
      resolveRewardContract: ({ contractFactory, address }) =>
        contractFactory.curveVotingEscrowReward({ network, address }),
      resolveLockedTokenAddress: ({ contract, multicall }) => multicall.wrap(contract).token(),
      resolveRewardTokenAddress: ({ contract, multicall }) => multicall.wrap(contract).token(),
    });
  }
}
