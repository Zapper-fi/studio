import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { AAVE_V2_DEFINITION } from '~apps/aave-v2';
import { ARRAKIS_DEFINITION } from '~apps/arrakis/arrakis.definition';
import { CompoundContractFactory } from '~apps/compound';
import { CURVE_DEFINITION } from '~apps/curve';
import { OLYMPUS_DEFINITION } from '~apps/olympus';
import { YEARN_DEFINITION } from '~apps/yearn';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { RariFuseContractFactory } from '../contracts';
import { RariFuseSupplyTokenHelper } from '../helpers/rari-fuse.supply.token-helper';
import { RARI_FUSE_DEFINITION } from '../rari-fuse.definition';

const appId = RARI_FUSE_DEFINITION.id;
const groupId = RARI_FUSE_DEFINITION.groups.supply.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumRariFuseSupplyTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(CompoundContractFactory) private readonly compoundContractFactory: CompoundContractFactory,
    @Inject(RariFuseContractFactory) private readonly contractFactory: RariFuseContractFactory,
    @Inject(RariFuseSupplyTokenHelper) private readonly rariFuseSupplyTokenHelper: RariFuseSupplyTokenHelper,
  ) {}

  async getPositions() {
    return this.rariFuseSupplyTokenHelper.getTokens({
      network,
      appId,
      groupId,
      dependencies: [
        { appId: CURVE_DEFINITION.id, groupIds: [CURVE_DEFINITION.groups.pool.id], network },
        { appId: AAVE_V2_DEFINITION.id, groupIds: [AAVE_V2_DEFINITION.groups.supply.id], network },
        {
          appId: YEARN_DEFINITION.id,
          groupIds: [YEARN_DEFINITION.groups.v1Vault.id, YEARN_DEFINITION.groups.v2Vault.id],
          network,
        },
        { appId: OLYMPUS_DEFINITION.id, groupIds: [OLYMPUS_DEFINITION.groups.gOhm.id], network },
        { appId: ARRAKIS_DEFINITION.id, groupIds: [ARRAKIS_DEFINITION.groups.pool.id], network },
        { appId: 'mstable', groupIds: ['imusd'], network },
        { appId: 'sushiswap', groupIds: ['x-sushi'], network },
        { appId: 'harvest', groupIds: ['i-farm'], network },
      ],
      poolDirectoryAddress: '0x835482fe0532f169024d5e9410199369aad5c77e',
      getRariFusePoolsDirectory: ({ address, network }) =>
        this.contractFactory.rariFusePoolsDirectory({ address, network }),
      getComptrollerContract: ({ address, network }) =>
        this.compoundContractFactory.compoundComptroller({ address, network }),
      getTokenContract: ({ address, network }) => this.compoundContractFactory.compoundCToken({ address, network }),
      getAllMarkets: ({ contract, multicall }) => multicall.wrap(contract).getAllMarkets(),
      getExchangeRate: async ({ contract, multicall }) =>
        multicall
          .wrap(contract)
          .exchangeRateCurrent()
          .catch(() => 0),
      getSupplyRate: ({ contract, multicall }) => multicall.wrap(contract).supplyRatePerBlock(),
      getBorrowRate: ({ contract, multicall }) => multicall.wrap(contract).borrowRatePerBlock(),
      getUnderlyingAddress: ({ contract, multicall }) => multicall.wrap(contract).underlying(),
      getExchangeRateMantissa: ({ underlyingTokenDecimals, tokenDecimals }) =>
        18 + underlyingTokenDecimals - tokenDecimals,
      getDisplayLabel: async ({ underlyingToken }) => getLabelFromToken(underlyingToken),
    });
  }
}
