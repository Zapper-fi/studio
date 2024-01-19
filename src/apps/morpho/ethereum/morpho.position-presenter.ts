import { Inject } from '@nestjs/common';
import { BigNumber, constants, Contract } from 'ethers';
import { formatUnits, parseUnits } from 'ethers/lib/utils';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PresenterTemplate } from '~app-toolkit/decorators/presenter-template.decorator';
import { MetadataItemWithLabel } from '~balance/balance-fetcher.interface';
import { ViemMulticallDataLoader } from '~multicall/impl/multicall.viem';

import { PositionPresenterTemplate, ReadonlyBalances } from '~position/template/position-presenter.template';
import { MorphoViemContractFactory } from '../contracts';
import { MorphoBlueMath, OraclePriceAbi } from '../utils/morpho-blue/Blue.maths';
import { MarketParams, MarketState, UserPosition } from '../utils/morpho-blue/interfaces';
import { MorphoBlueMarkets } from '../utils/morpho-blue/markets';

export type EthereumMorphoPositionPresenterDataProps = {
  healthFactorMA2: number;
  healthFactorMC: number;
  healthFactorMA3: number;
  healthFactorsMorphoBlue: {
    [marketId: string]: number;
  };
};

@PresenterTemplate()
export class EthereumMorphoPositionPresenter extends PositionPresenterTemplate<EthereumMorphoPositionPresenterDataProps> {
  morphoCompoundLensAddress = '0x930f1b46e1d081ec1524efd95752be3ece51ef67';
  morphoAaveLensAddress = '0x507fa343d0a90786d86c7cd885f5c49263a91ff4';
  morphoAaveV3Address = '0x33333aea097c193e66081e930c33020272b33333';
  morphoBlueAddress = '0xbbbbbbbbbb9cc5e90e3b3af64bdaf62c37eeffcb';
  whitelistedIds = MorphoBlueMarkets.whitelistedIds;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(MorphoViemContractFactory) protected readonly contractFactory: MorphoViemContractFactory,
  ) {
    super();
  }

  override async dataProps(address: string): Promise<EthereumMorphoPositionPresenterDataProps | undefined> {
    const multicall = this.appToolkit.getViemMulticall(this.network);

    // Fetch health factors for Morpho AaveV2, Morpho Compound, and Morpho AaveV3
    const [healthFactorMA2, healthFactorMC, healthFactorMA3] = await Promise.all([
      this._fetchHealthFactorMA2(address, multicall),
      this._fetchHealthFactorMC(address, multicall),
      this._fetchHealthFactorMA3(address, multicall),
    ]);

    const healthFactorsMorphoBlue: { [marketId: string]: number } = await this._fetchMorphoBlueHealthFactors(
      address,
      multicall,
    );

    return {
      healthFactorMA2,
      healthFactorMC,
      healthFactorMA3,
      healthFactorsMorphoBlue,
    };
  }

  private async _fetchHealthFactorMA2(address: string, multicall: ViemMulticallDataLoader): Promise<number> {
    const aaveV2Lens = multicall.wrap(
      this.contractFactory.morphoAaveV2Lens({
        address: this.morphoAaveLensAddress,
        network: this.network,
      }),
    );
    const healthFactorMA2Raw = aaveV2Lens.read.getUserHealthFactor([address]);
    return +formatUnits(BigNumber.from(healthFactorMA2Raw));
  }

  private async _fetchHealthFactorMC(address: string, multicall: ViemMulticallDataLoader): Promise<number> {
    const compoundLens = multicall.wrap(
      this.contractFactory.morphoCompoundLens({
        address: this.morphoCompoundLensAddress,
        network: this.network,
      }),
    );
    const healthFactorMCRaw = compoundLens.read.getUserHealthFactor([address, []]);
    return +formatUnits(BigNumber.from(healthFactorMCRaw));
  }

  private async _fetchHealthFactorMA3(address: string, multicall: ViemMulticallDataLoader): Promise<number> {
    const morphoAaveV3 = multicall.wrap(
      this.contractFactory.morphoAaveV3({
        address: this.morphoAaveV3Address,
        network: this.network,
      }),
    );
    const liquidityDataMA3Raw = await morphoAaveV3.read.liquidityData([address]);
    const maxDebtMA3 = BigNumber.from(liquidityDataMA3Raw.maxDebt);
    const debtMA3 = BigNumber.from(liquidityDataMA3Raw.debt);
    const unit = parseUnits('1');
    return +formatUnits(debtMA3.eq(0) ? constants.MaxInt256 : maxDebtMA3.mul(unit).div(debtMA3));
  }

  private async _calculateHealthFactor(
    positionData: UserPosition,
    marketState: MarketState,
    marketParams: MarketParams,
    address: string,
    multicall: ViemMulticallDataLoader,
    marketId: string,
  ): Promise<{ marketId: string; healthFactor: BigNumber }> {
    const provider = this.appToolkit.getNetworkProvider(this.network);
    const blockNumber = await provider.getBlockNumber();
    const timestamp = (await provider.getBlock(blockNumber)).timestamp;

    const irm = multicall.wrap(
      this.contractFactory.morphoAdaptiveCurve({
        address: this.morphoBlueAddress,
        network: this.network,
      }),
    );
    const borrowRate = await irm.read.borrowRateView([
      {
        loanToken: marketParams.loanToken,
        collateralToken: marketParams.collateralToken,
        oracle: marketParams.oracle,
        irm: marketParams.irm,
        lltv: BigInt(Number(marketParams.lltv)),
      },
      {
        totalSupplyAssets: BigInt(Number(marketState.totalSupplyAssets)),
        totalSupplyShares: BigInt(Number(marketState.totalSupplyShares)),
        totalBorrowAssets: BigInt(Number(marketState.totalBorrowAssets)),
        totalBorrowShares: BigInt(Number(marketState.totalBorrowShares)),
        lastUpdate: BigInt(Number(marketState.lastUpdate)),
        fee: BigInt(Number(marketState.fee)),
      },
    ]);

    const rate = BigNumber.from(Number(borrowRate));
    const newMarketState = MorphoBlueMath.computeInterest(BigNumber.from(timestamp), marketState, rate);
    const oracleContract = new Contract(
      marketParams.oracle,
      OraclePriceAbi,
      this.appToolkit.getNetworkProvider(this.network),
    );
    const priceRaw = await oracleContract.price();
    const price = BigNumber.from(priceRaw);
    const healthFactor = MorphoBlueMath.getHealthFactor(positionData, newMarketState, marketParams, price);
    return { marketId, healthFactor };
  }

  private async _fetchMorphoBlueHealthFactors(
    address: string,
    multicall: ViemMulticallDataLoader,
  ): Promise<{ [marketId: string]: number }> {
    const morphoBlue = multicall.wrap(
      this.contractFactory.morphoBlue({
        address: this.morphoBlueAddress,
        network: this.network,
      }),
    );

    const marketResults = await Promise.all(
      this.whitelistedIds.map(async marketId => {
        // Fetch user position, market data, and market parameters for each market
        const [positionDataRaw, marketDataRaw, marketParamsRaw] = await Promise.all([
          morphoBlue.read.position([marketId, address]),
          morphoBlue.read.market([marketId]),
          morphoBlue.read.idToMarketParams([marketId]),
        ]);

        // Convert the raw position data to UserPosition structure
        const positionData: UserPosition = {
          supplyShares: BigNumber.from(positionDataRaw[0]),
          borrowShares: BigNumber.from(positionDataRaw[1]),
          collateral: BigNumber.from(positionDataRaw[2]),
        };

        // Convert the raw market data to MarketState structure (assuming it returns an array of BigNumbers)
        const marketState: MarketState = {
          totalSupplyAssets: BigNumber.from(marketDataRaw[0]),
          totalSupplyShares: BigNumber.from(marketDataRaw[1]),
          totalBorrowAssets: BigNumber.from(marketDataRaw[2]),
          totalBorrowShares: BigNumber.from(marketDataRaw[3]),
          lastUpdate: BigNumber.from(marketDataRaw[4]),
          fee: BigNumber.from(marketDataRaw[5]),
        };

        // Convert the raw market params data to MarketParams structure (assuming it returns an array with the expected types)
        const marketParams: MarketParams = {
          loanToken: marketParamsRaw[0],
          collateralToken: marketParamsRaw[1],
          oracle: marketParamsRaw[2],
          irm: marketParamsRaw[3],
          lltv: BigNumber.from(marketParamsRaw[4]),
        };

        if (positionData.borrowShares.eq(0)) {
          const healthFactor = BigNumber.from(MorphoBlueMath.MAX_UINT_256);
          return { marketId, healthFactor };
        }
        return this._calculateHealthFactor(positionData, marketState, marketParams, address, multicall, marketId);
      }),
    );

    const healthFactors: { [marketId: string]: number } = {};

    marketResults.forEach(result => {
      healthFactors[result.marketId] = Number(result.healthFactor);
    });

    return healthFactors;
  }

  override metadataItemsForBalanceGroup(
    groupLabel: string,
    _balances: ReadonlyBalances,
    dataProps?: EthereumMorphoPositionPresenterDataProps,
  ): MetadataItemWithLabel[] {
    if (!dataProps) return [];

    const format = (label: string, hf: number) =>
      [
        {
          label: label,
          value: hf,
          type: 'number',
        },
      ] as MetadataItemWithLabel[];

    const metadataItems: MetadataItemWithLabel[] = [];

    // Handle Morpho Compound case
    if (groupLabel === 'Morpho Compound') {
      metadataItems.push(...format('Health Factor MC', dataProps.healthFactorMC));
    }

    // Handle Morpho Aave case
    if (groupLabel === 'Morpho Aave') {
      metadataItems.push(...format('Health Factor MA2', dataProps.healthFactorMA2));
    }

    // Handle Morpho AaveV3 case
    if (groupLabel === 'Morpho AaveV3') {
      metadataItems.push(...format('Health Factor MA3', dataProps.healthFactorMA3));
    }

    // Handle Morpho Blue case
    if (groupLabel === 'Morpho Blue markets') {
      Object.entries(dataProps.healthFactorsMorphoBlue).forEach(([marketId, healthFactor]) => {
        metadataItems.push(...format(`Health Factor (${marketId})`, healthFactor));
      });
    }

    return metadataItems;
  }
}
