import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { CurveVestingEscrow } from '../contracts';
import { CURVE_DEFINITION } from '../curve.definition';
import { CurveVestingEscrowContractPositionHelper } from '../helpers/curve.vesting-escrow.contract-position-helper';

const appId = CURVE_DEFINITION.id;
const groupId = CURVE_DEFINITION.groups.vestingEscrow.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumCurveVestingEscrowContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(CurveVestingEscrowContractPositionHelper)
    private readonly curveVestingEscrowContractPositionHelper: CurveVestingEscrowContractPositionHelper,
  ) {}

  async getPositions() {
    return this.curveVestingEscrowContractPositionHelper.getContractPositions<CurveVestingEscrow>({
      vestingEscrowAddress: '0x575ccd8e2d300e2377b43478339e364000318e2c',
      appId: CURVE_DEFINITION.id,
      groupId: CURVE_DEFINITION.groups.vestingEscrow.id,
      network,
      resolveVestingEscrowContract: ({ contractFactory, address }) =>
        contractFactory.curveVestingEscrow({ network, address }),
      resolveVestingTokenAddress: ({ contract, multicall }) => multicall.wrap(contract).token(),
    });
  }
}
