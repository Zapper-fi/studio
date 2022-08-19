import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { CompoundContractFactory } from '~apps/compound';
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
