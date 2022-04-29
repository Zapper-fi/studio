import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { CurveVotingEscrowContractPositionHelper } from '~apps/curve/helpers/curve.voting-escrow.contract-position-helper';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { BALANCER_V2_DEFINITION } from '../balancer-v2.definition';
import { BalancerV2ContractFactory, BalancerVeBal } from '../contracts';

const appId = BALANCER_V2_DEFINITION.id;
const groupId = BALANCER_V2_DEFINITION.groups.votingEscrow.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumBalancerV2VotingEscrowContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(CurveVotingEscrowContractPositionHelper)
    private readonly curveVotingEscrowContractPositionHelper: CurveVotingEscrowContractPositionHelper,
    @Inject(BalancerV2ContractFactory)
    private readonly balancerV2ContractFactory: BalancerV2ContractFactory,
  ) {}

  async getPositions() {
    const network = Network.ETHEREUM_MAINNET;
    return this.curveVotingEscrowContractPositionHelper.getContractPositions<BalancerVeBal>({
      votingEscrowAddress: '0xc128a9954e6c874ea3d62ce62b468ba073093f25',
      appId: BALANCER_V2_DEFINITION.id,
      groupId: BALANCER_V2_DEFINITION.groups.votingEscrow.id,
      network,
      appTokenDependencies: [
        { appId: BALANCER_V2_DEFINITION.id, groupIds: [BALANCER_V2_DEFINITION.groups.pool.id], network },
      ],
      resolveContract: ({ address }) => this.balancerV2ContractFactory.balancerVeBal({ network, address }),
      resolveLockedTokenAddress: ({ contract, multicall }) => multicall.wrap(contract).token(),
    });
  }
}
