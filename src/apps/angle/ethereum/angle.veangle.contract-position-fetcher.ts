import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { CurveVotingEscrowContractPositionHelper } from '~apps/curve/helpers/curve.voting-escrow.contract-position-helper';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { ANGLE_DEFINITION } from '../angle.definition';
import { AngleContractFactory, AngleVeangle, AngleLiquidityGauge } from '../contracts';

const appId = ANGLE_DEFINITION.id;
const groupId = ANGLE_DEFINITION.groups.veangle.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumAngleVeAngleContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(AngleContractFactory) private readonly angleContractFactory: AngleContractFactory,
    @Inject(CurveVotingEscrowContractPositionHelper)
    private readonly curveVotingEscrowContractPositionHelper: CurveVotingEscrowContractPositionHelper,
  ) {}

  async getPositions() {
    return this.curveVotingEscrowContractPositionHelper.getContractPositions<AngleVeangle, AngleLiquidityGauge>({
      votingEscrowAddress: '0x0c462dbb9ec8cd1630f1728b2cfd2769d09f0dd5',
      votingEscrowRewardAddress: '0x51fe22abaf4a26631b2913e417c0560d547797a7',
      appId,
      groupId,
      network,
      appTokenDependencies: [
        {
          appId,
          groupIds: [ANGLE_DEFINITION.groups.veangle.id, ANGLE_DEFINITION.groups.santoken.id],
          network,
        },
      ],
      resolveContract: ({ address }) => this.angleContractFactory.angleVeangle({ network, address }),
      resolveLockedTokenAddress: ({ contract, multicall }) => multicall.wrap(contract).token(),
      resolveRewardTokenAddress: ({ contract, multicall }) => multicall.wrap(contract).staking_token(),
      resolveRewardContract: ({ address }) => this.angleContractFactory.angleLiquidityGauge({ address, network }),
    });
  }
}
