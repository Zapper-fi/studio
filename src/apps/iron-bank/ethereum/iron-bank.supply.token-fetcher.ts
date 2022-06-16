import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { CompoundSupplyTokenHelper } from '~apps/compound/helper/compound.supply.token-helper';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { IronBankContractFactory } from '../contracts';
import { IRON_BANK_DEFINITION } from '../iron-bank.definition';

const appId = IRON_BANK_DEFINITION.id;
const groupId = IRON_BANK_DEFINITION.groups.supply.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumIronBankSupplyTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(IronBankContractFactory) private readonly ironBankContractFactory: IronBankContractFactory,
    @Inject(CompoundSupplyTokenHelper) private readonly compoundSupplyTokenHelper: CompoundSupplyTokenHelper,
  ) {}

  async getPositions() {
    return this.compoundSupplyTokenHelper.getTokens({
      network,
      appId,
      groupId,
      comptrollerAddress: '0xAB1c342C7bf5Ec5F02ADEA1c2270670bCa144CbB',
      getComptrollerContract: ({ address, network }) =>
        this.ironBankContractFactory.ironBankComptroller({ address, network }),
      getTokenContract: ({ address, network }) => this.ironBankContractFactory.ironBankCToken({ address, network }),
      getAllMarkets: ({ contract, multicall }) => multicall.wrap(contract).getAllMarkets(),
      getExchangeRate: ({ contract, multicall }) => multicall.wrap(contract).exchangeRateCurrent(),
      getSupplyRate: ({ contract, multicall }) => multicall.wrap(contract).supplyRatePerBlock(),
      getBorrowRate: ({ contract, multicall }) => multicall.wrap(contract).borrowRatePerBlock(),
      getBorrowRateLabel: () => 'Borrow APY',
      getUnderlyingAddress: ({ contract, multicall }) => multicall.wrap(contract).underlying(),
      getExchangeRateMantissa: ({ underlyingTokenDecimals }) => underlyingTokenDecimals + 10,
    });
  }
}
