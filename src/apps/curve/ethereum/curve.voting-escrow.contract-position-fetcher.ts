import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { CurveVotingEscrow, CurveVotingEscrowReward } from '../contracts';
import { CURVE_DEFINITION } from '../curve.definition';
import { CurveVotingEscrowContractPositionHelper } from '../helpers/curve.voting-escrow.contract-position-helper';

const appId = CURVE_DEFINITION.id;
const groupId = CURVE_DEFINITION.groups.votingEscrow.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network, options: { includeInTvl: true } })
export class EthereumCurveVotingEscrowContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(CurveVotingEscrowContractPositionHelper)
    private readonly curveVotingEscrowContractPositionHelper: CurveVotingEscrowContractPositionHelper,
  ) {}

  async getPositions() {
    return this.curveVotingEscrowContractPositionHelper.getContractPositions<
      CurveVotingEscrow,
      CurveVotingEscrowReward
    >({
      votingEscrowAddress: '0x5f3b5dfeb7b28cdbd7faba78963ee202a494e2a2',
      votingEscrowRewardAddress: '0xa464e6dcda8ac41e03616f95f4bc98a13b8922dc',
      appId: CURVE_DEFINITION.id,
      groupId: CURVE_DEFINITION.groups.votingEscrow.id,
      network,
      appTokenDependencies: [
        {
          appId: CURVE_DEFINITION.id,
          groupIds: [CURVE_DEFINITION.groups.pool.id],
          network,
        },
      ],
      resolveContract: ({ contractFactory, address }) => contractFactory.curveVotingEscrow({ network, address }),
      resolveRewardContract: ({ contractFactory, address }) =>
        contractFactory.curveVotingEscrowReward({ network, address }),
      resolveLockedTokenAddress: ({ contract, multicall }) => multicall.wrap(contract).token(),
      resolveRewardTokenAddress: ({ contract, multicall }) => multicall.wrap(contract).token(),
    });
  }
}
