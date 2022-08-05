import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { CurveVotingEscrowContractPositionHelper } from '~apps/curve/helpers/curve.voting-escrow.contract-position-helper';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { DopexContractFactory, DopexVotingEscrow, DopexVotingEscrowRewards } from '../contracts';
import { DOPEX_DEFINITION } from '../dopex.definition';

const appId = DOPEX_DEFINITION.id;
const groupId = DOPEX_DEFINITION.groups.votingEscrow.id;
const network = Network.ARBITRUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class ArbitrumDopexVotingEscrowContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(DopexContractFactory)
    private readonly dopexContractFactory: DopexContractFactory,
    @Inject(CurveVotingEscrowContractPositionHelper)
    private readonly curveVotingEscrowContractPositionHelper: CurveVotingEscrowContractPositionHelper,
  ) {}

  async getPositions() {
    return this.curveVotingEscrowContractPositionHelper.getContractPositions<
      DopexVotingEscrow,
      DopexVotingEscrowRewards
    >({
      votingEscrowAddress: '0x80789d252a288e93b01d82373d767d71a75d9f16',
      votingEscrowRewardAddress: '0xcbbfb7e0e6782df0d3e91f8d785a5bf9e8d9775f',
      appId,
      groupId,
      network,
      resolveContract: ({ address }) => this.dopexContractFactory.dopexVotingEscrow({ network, address }),
      resolveRewardContract: ({ address }) => this.dopexContractFactory.dopexVotingEscrowRewards({ network, address }),
      resolveLockedTokenAddress: ({ contract, multicall }) => multicall.wrap(contract).token(),
      resolveRewardTokenAddress: ({ contract, multicall }) => multicall.wrap(contract).emittedToken(),
    });
  }
}
