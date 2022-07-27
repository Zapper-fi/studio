import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { AAVE_V2_DEFINITION } from '~apps/aave-v2/aave-v2.definition';
import { COMPOUND_DEFINITION } from '~apps/compound';
import { IRON_BANK_DEFINITION } from '~apps/iron-bank';
import { SYNTHETIX_DEFINITION } from '~apps/synthetix';
import { TOKEMAK_DEFINITION } from '~apps/tokemak/tokemak.definition';
import { YEARN_DEFINITION } from '~apps/yearn/yearn.definition';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { CURVE_DEFINITION } from '../curve.definition';
import { CurveDefaultPoolTokenHelper } from '../helpers/pool/curve.default.token-helper';
import { CurvePoolTokenRegistry } from '../helpers/pool/curve.pool-token.registry';

const appId = CURVE_DEFINITION.id;
const groupId = CURVE_DEFINITION.groups.pool.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumCurvePoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(CurveDefaultPoolTokenHelper)
    private readonly curveDefaultPoolTokenHelper: CurveDefaultPoolTokenHelper,
    @Inject(CurvePoolTokenRegistry)
    private readonly curvePoolTokenRegistry: CurvePoolTokenRegistry,
  ) {}

  async getPositions() {
    return this.curveDefaultPoolTokenHelper.getTokens({
      network,
      poolDefinitions: await this.curvePoolTokenRegistry.getPoolDefinitions(network),
      dependencies: [
        { appId: AAVE_V2_DEFINITION.id, groupIds: [AAVE_V2_DEFINITION.groups.supply.id], network },
        { appId: COMPOUND_DEFINITION.id, groupIds: [COMPOUND_DEFINITION.groups.supply.id], network },
        { appId: SYNTHETIX_DEFINITION.id, groupIds: [SYNTHETIX_DEFINITION.groups.synth.id], network },
        { appId: IRON_BANK_DEFINITION.id, groupIds: [IRON_BANK_DEFINITION.groups.supply.id], network },
        { appId: TOKEMAK_DEFINITION.id, groupIds: [TOKEMAK_DEFINITION.groups.reactor.id], network },
        { appId: YEARN_DEFINITION.id, groupIds: [YEARN_DEFINITION.groups.yield.id], network },
        { appId: 'convex', groupIds: ['deposit'], network },
        { appId: 'fixed-forex', groupIds: ['forex'], network },
      ],
    });
  }
}
