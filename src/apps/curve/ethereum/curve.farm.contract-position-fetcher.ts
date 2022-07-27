import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { CurveContractFactory } from '../contracts';
import { CURVE_DEFINITION } from '../curve.definition';
import { CurvePoolTokenRegistry } from '../helpers/pool/curve.pool-token.registry';

const appId = CURVE_DEFINITION.id;
const groupId = CURVE_DEFINITION.groups.farm.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumCurveFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(CurveContractFactory)
    private readonly curveContractFactory: CurveContractFactory,
    @Inject(CurvePoolTokenRegistry)
    private readonly curvePoolTokenRegistry: CurvePoolTokenRegistry,
  ) {}

  async getPositions() {
    const test = await this.curvePoolTokenRegistry.getGaugesWithType(network);
    return [];
  }
}
