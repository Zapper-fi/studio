import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { MorphoAaveV2, MorphoAaveV2Lens, MorphoContractFactory } from '~apps/morpho/contracts';
import { BaseEthereumMorphoSupplyContractPositionFetcher } from '~apps/morpho/helpers/position-fetcher.common';
import { isMulticallUnderlyingError } from '~multicall/multicall.ethers';
import { GetDefinitionsParams } from '~position/template/contract-position.template.types';

@PositionTemplate()
export class EthereumMorphoAaveV2SupplyContractPositionFetcher extends BaseEthereumMorphoSupplyContractPositionFetcher<MorphoAaveV2> {
  groupLabel = 'Morpho Aave';

  morphoAddress = '0x777777c9898d384f785ee44acfe945efdff5f3e0';
  lensAddress = '0x507fa343d0a90786d86c7cd885f5c49263a91ff4';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(MorphoContractFactory) protected readonly contractFactory: MorphoContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.morphoAaveV2({ address, network: this.network });
  }

  async getDefinitions({ multicall }: GetDefinitionsParams) {
    const morphoAaveV2 = this.contractFactory.morphoAaveV2({ address: this.morphoAddress, network: this.network });

    const morpho = multicall.wrap(morphoAaveV2);
    const markets = await morpho.getMarketsCreated();

    return Promise.all(
      markets.map(async marketAddress => {
        const market = this.contractFactory.morphoAToken({ address: marketAddress, network: this.network });
        const marketContract = multicall.wrap(market);
        const supplyTokenAddress = await marketContract.UNDERLYING_ASSET_ADDRESS().catch(err => {
          if (isMulticallUnderlyingError(err)) return ZERO_ADDRESS;
          throw err;
        });
        return {
          address: this.morphoAddress,
          marketAddress: marketAddress.toLowerCase(),
          supplyTokenAddress: supplyTokenAddress.toLowerCase(),
        };
      }),
    );
  }

  async getDataProps({ contractPosition, multicall, definition }) {
    const lens = this.contractFactory.morphoAaveV2Lens({ address: this.lensAddress, network: this.network });
    const lensContract = multicall.wrap(lens) as MorphoAaveV2Lens;
    const marketAddress = definition.marketAddress;

    const [supplyRateRaw, borrowRateRaw, totalMarketSupplyRaw, totalMarketBorrowRaw, marketConfiguration] =
      await Promise.all([
        lensContract.getAverageSupplyRatePerYear(marketAddress),
        lensContract.getAverageBorrowRatePerYear(marketAddress),
        lensContract.getTotalMarketSupply(marketAddress),
        lensContract.getTotalMarketBorrow(marketAddress),
        lensContract.getMarketConfiguration(marketAddress),
      ]);

    const secondsPerYear = 3600 * 24 * 365;
    const supplyRate = supplyRateRaw.avgSupplyRatePerYear;
    const borrowRate = borrowRateRaw.avgBorrowRatePerYear;
    const supplyApy = Math.pow(1 + +formatUnits(supplyRate.div(secondsPerYear), 27), secondsPerYear) - 1;
    const borrowApy = Math.pow(1 + +formatUnits(borrowRate.div(secondsPerYear), 27), secondsPerYear) - 1;
    const p2pDisabled = marketConfiguration.isP2PDisabled;

    const underlyingToken = contractPosition.tokens[0];
    const supplyRaw = totalMarketSupplyRaw.p2pSupplyAmount.add(totalMarketSupplyRaw.poolSupplyAmount);
    const supply = +formatUnits(supplyRaw, underlyingToken.decimals);
    const supplyUSD = supply * underlyingToken.price;
    const borrowRaw = totalMarketBorrowRaw.p2pBorrowAmount.add(totalMarketBorrowRaw.poolBorrowAmount);
    const matchedUSD = +formatUnits(borrowRaw, underlyingToken.decimals) * underlyingToken.price;
    const borrow = +formatUnits(borrowRaw, underlyingToken.decimals);
    const borrowUSD = borrow * underlyingToken.price;
    const liquidity = supply * underlyingToken.price;

    return {
      marketAddress,
      supplyApy,
      borrowApy,
      liquidity,
      p2pDisabled,
      supply,
      supplyUSD,
      borrow,
      borrowUSD,
      matchedUSD,
    };
  }

  async getTokenBalancesPerPosition({ address, contractPosition, multicall }): Promise<BigNumber[]> {
    const _lens = this.contractFactory.morphoAaveV2Lens({ address: this.lensAddress, network: this.network });
    const lens = multicall.wrap(_lens) as MorphoAaveV2Lens;

    const [{ totalBalance: supplyRaw }, { totalBalance: borrowRaw }] = await Promise.all([
      lens.getCurrentSupplyBalanceInOf(contractPosition.dataProps.marketAddress, address),
      lens.getCurrentBorrowBalanceInOf(contractPosition.dataProps.marketAddress, address),
    ]);
    return [supplyRaw, borrowRaw];
  }
}
