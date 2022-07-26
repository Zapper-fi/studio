import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { CURVE_DEFINITION } from '../curve.definition';
import { CurveCryptoPoolTokenHelper } from '../helpers/curve.crypto-pool.token-helper';
import { CurveFactoryPoolTokenHelper } from '../helpers/curve.factory-pool.token-helper';
import { CurveStablePoolTokenHelper } from '../helpers/curve.stable-pool.token-helper';
import { CurveOnChainRegistry } from '../helpers/registry/curve.on-chain.registry';

const appId = CURVE_DEFINITION.id;
const groupId = CURVE_DEFINITION.groups.pool.id;
const network = Network.ARBITRUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class ArbitrumCurvePoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(CurveStablePoolTokenHelper)
    private readonly curveStablePoolTokenHelper: CurveStablePoolTokenHelper,
    @Inject(CurveCryptoPoolTokenHelper)
    private readonly curveCryptoPoolTokenHelper: CurveCryptoPoolTokenHelper,
    @Inject(CurveFactoryPoolTokenHelper)
    private readonly curveFactoryPoolTokenHelper: CurveFactoryPoolTokenHelper,
    @Inject(CurveOnChainRegistry)
    private readonly curveOnChainRegistry: CurveOnChainRegistry,
  ) {}

  async getPositions() {
    const [stableBasePools] = await Promise.all([
      this.curveStablePoolTokenHelper.getTokens({
        network,
        appId,
        groupId,
        poolDefinitions: await this.curveOnChainRegistry.getStableSwapRegistryBasePoolDefinitions(network),
        statsUrl: 'https://stats.curve.fi/raw-stats-arbitrum/apys.json',
      }),
    ]);

    const [stableMetaPools, cryptoPools, factoryPools] = await Promise.all([
      this.curveStablePoolTokenHelper.getTokens({
        network,
        appId,
        groupId,
        poolDefinitions: await this.curveOnChainRegistry.getStableSwapRegistryMetaPoolDefinitions(network),
        statsUrl: 'https://stats.curve.fi/raw-stats-arbitrum/apys.json',
        baseCurveTokens: stableBasePools,
      }),
      this.curveCryptoPoolTokenHelper.getTokens({
        network,
        appId,
        groupId,
        poolDefinitions: await this.curveOnChainRegistry.getCryptoSwapRegistryPoolDefinitions(network),
        statsUrl: 'https://stats.curve.fi/raw-stats-arbitrum/apys.json',
        baseCurveTokens: stableBasePools,
      }),
      this.curveFactoryPoolTokenHelper.getTokens({
        factoryAddress: '0xb17b674d9c5cb2e441f8e196a2f048a81355d031',
        network,
        appId,
        groupId,
        baseCurveTokens: stableBasePools,
        skipVolume: true,
      }),
    ]);

    return _([stableBasePools, stableMetaPools, cryptoPools, factoryPools])
      .flatten()
      .uniqBy(v => v.address)
      .value();
  }
}
