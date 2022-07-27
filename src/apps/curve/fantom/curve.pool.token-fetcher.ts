import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { IRON_BANK_DEFINITION } from '~apps/iron-bank/iron-bank.definition';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { CURVE_DEFINITION } from '../curve.definition';
import { CurveDefaultPoolTokenHelper } from '../helpers/curve.default.token-helper';
import { CurvePoolTokenRegistry } from '../helpers/pool-token/curve.pool-token.registry';

const appId = CURVE_DEFINITION.id;
const groupId = CURVE_DEFINITION.groups.pool.id;
const network = Network.FANTOM_OPERA_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class FantomCurvePoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(CurvePoolTokenRegistry)
    private readonly curveOnChainRegistry: CurvePoolTokenRegistry,
    @Inject(CurveDefaultPoolTokenHelper)
    private readonly curveDefaultPoolTokenHelper: CurveDefaultPoolTokenHelper,
  ) {}

  async getPositions() {
    return this.curveDefaultPoolTokenHelper.getTokens({
      network,
      poolDefinitions: await this.curveOnChainRegistry.getPoolDefinitions(network),
      dependencies: [
        { appId: IRON_BANK_DEFINITION.id, groupIds: [IRON_BANK_DEFINITION.groups.supply.id], network },
        { appId: 'geist', groupIds: ['supply'], network },
      ],
    });
  }
}
