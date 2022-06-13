import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { CompoundSupplyTokenHelper } from '~apps/compound';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { AURIGAMI_DEFINITION } from '../aurigami.definition';
import { AurigamiAuToken, AurigamiComptroller, AurigamiContractFactory } from '../contracts';

const appId = AURIGAMI_DEFINITION.id;
const groupId = AURIGAMI_DEFINITION.groups.supply.id;
const network = Network.AURORA_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class AuroraAurigamiSupplyTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(AurigamiContractFactory) private readonly aurigamiContractFactory: AurigamiContractFactory,
    @Inject(CompoundSupplyTokenHelper) private readonly compoundSupplyTokenHelper: CompoundSupplyTokenHelper,
  ) {}

  async getPositions() {
    return this.compoundSupplyTokenHelper.getTokens<AurigamiComptroller, AurigamiAuToken>({
      network,
      appId,
      groupId,
      comptrollerAddress: '0x817af6cfAF35BdC1A634d6cC94eE9e4c68369Aeb',
      getComptrollerContract: ({ address, network }) =>
        this.aurigamiContractFactory.aurigamiComptroller({ address, network }),
      getTokenContract: ({ address, network }) => this.aurigamiContractFactory.aurigamiAuToken({ address, network }),
      getAllMarkets: ({ contract, multicall }) => multicall.wrap(contract).getAllMarkets(),
      getExchangeRate: ({ contract, multicall }) => multicall.wrap(contract).callStatic.exchangeRateCurrent(),
      getSupplyRate: ({ contract, multicall }) => multicall.wrap(contract).supplyRatePerTimestamp(),
      getBorrowRate: ({ contract, multicall }) => multicall.wrap(contract).borrowRatePerTimestamp(),
      getUnderlyingAddress: ({ contract, multicall }) => multicall.wrap(contract).underlying(),
      getExchangeRateMantissa: ({ underlyingTokenDecimals, tokenDecimals }) =>
        18 + underlyingTokenDecimals - tokenDecimals,
    });
  }
}
