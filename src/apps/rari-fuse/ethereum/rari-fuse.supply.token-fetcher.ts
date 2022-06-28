import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { CompoundContractFactory } from '~apps/compound';
import { CompoundSupplyTokenHelper } from '~apps/compound/helper/compound.supply.token-helper';
import { CURVE_DEFINITION } from '~apps/curve';
import { OLYMPUS_DEFINITION } from '~apps/olympus';
import { YEARN_DEFINITION } from '~apps/yearn';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { RariFuseContractFactory } from '../contracts';
import { RARI_FUSE_DEFINITION } from '../rari-fuse.definition';

const appId = RARI_FUSE_DEFINITION.id;
const groupId = RARI_FUSE_DEFINITION.groups.supply.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumRariFuseSupplyTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(CompoundContractFactory) private readonly compoundContractFactory: CompoundContractFactory,
    @Inject(CompoundSupplyTokenHelper) private readonly compoundSupplyTokenHelper: CompoundSupplyTokenHelper,
    @Inject(RariFuseContractFactory) private readonly contractFactory: RariFuseContractFactory,
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
  ) {}

  async getPositions() {
    const network = Network.ETHEREUM_MAINNET;
    const poolDirectoryAddress = '0x835482fe0532f169024d5e9410199369aad5c77e';
    const controllerContract = this.contractFactory.rariFusePoolsDirectory({ address: poolDirectoryAddress, network });
    const pools = await controllerContract.getAllPools();

    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const appTokens = await this.appToolkit.getAppTokenPositions(
      { appId: CURVE_DEFINITION.id, groupIds: [CURVE_DEFINITION.groups.pool.id], network },
      {
        appId: YEARN_DEFINITION.id,
        groupIds: [YEARN_DEFINITION.groups.v1Vault.id, YEARN_DEFINITION.groups.v2Vault.id],
        network,
      },
      { appId: OLYMPUS_DEFINITION.id, groupIds: [OLYMPUS_DEFINITION.groups.gOhm.id], network },
      { appId: 'mstable', groupIds: ['imusd'], network },
    );

    const markets = await Promise.all(
      pools.map(pool => {
        return this.compoundSupplyTokenHelper.getTokens({
          network,
          appId,
          groupId,
          comptrollerAddress: pool.comptroller.toLowerCase(),
          marketName: pool.name,
          allTokens: [...appTokens, ...baseTokens],
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
          getDisplayLabel: async ({ underlyingToken }) => `${underlyingToken.symbol} in ${pool.name}`,
        });
      }),
    );

    return markets.flat();
  }
}
