import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { CurveVotingEscrowContractPositionHelper } from '~apps/curve/helpers/curve.voting-escrow.contract-position-helper';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { ANGLE_DEFINITION } from '../angle.definition';
import { AngleContractFactory, AngleVeangle, AngleSantoken } from '../contracts';
import { AngleApiHelper } from '../helpers/angle.api';

const appId = ANGLE_DEFINITION.id;
const groupId = ANGLE_DEFINITION.groups.veangle.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumAngleVeAngleContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(AngleContractFactory) private readonly angleContractFactory: AngleContractFactory,
    @Inject(AngleApiHelper)
    private readonly angleApiHelper: AngleApiHelper,
    @Inject(CurveVotingEscrowContractPositionHelper)
    private readonly curveVotingEscrowContractPositionHelper: CurveVotingEscrowContractPositionHelper,
  ) {}

  async getPositions() {
    return this.curveVotingEscrowContractPositionHelper.getContractPositions<AngleVeangle, AngleSantoken>({
      votingEscrowAddress: '0x0C462Dbb9EC8cD1630f1728B2CFD2769d09f0dd5',
      votingEscrowRewardAddress: '0x51fE22abAF4a26631b2913E417c0560D547797a7',
      appId: ANGLE_DEFINITION.id,
      groupId: ANGLE_DEFINITION.groups.veangle.id,
      network,
      resolveContract: ({ address }) => this.angleContractFactory.angleVeangle({ network, address }),
      resolveLockedTokenAddress: ({ contract, multicall }) => multicall.wrap(contract).token(),
      resolveRewardTokenAddress: async () => '0x51fE22abAF4a26631b2913E417c0560D547797a7',
      resolveRewardContract: ({ address }) => this.angleContractFactory.angleSantoken({ address, network }),
    });
  }
}
