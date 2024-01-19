import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';
import { MorphoBlue } from '~apps/morpho/contracts/viem';

import { SECONDS_PER_YEAR } from '~apps/morpho/utils/AaveV3.maths';
import {
  MorphoContractPositionDataProps,
  MorphoContractPositionDefinition,
  MorphoSupplyContractPositionFetcher,
} from '~apps/morpho/utils/morpho-blue/blue.contract-position-fetcher';

import {
  GetDataPropsParams,
  GetDefinitionsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';

import { MorphoViemContractFactory } from '../contracts';
import { MorphoBlueMath } from '../utils/morpho-blue/Blue.maths';
import { MarketState } from '../utils/morpho-blue/interfaces';
import { MorphoBlueMarkets, MarketCollateralResponse } from '../utils/morpho-blue/markets';

@PositionTemplate()
export class EthereumMorphoBlueSupplyContractPositionFetcher extends MorphoSupplyContractPositionFetcher<MorphoBlue> {
  groupLabel = 'Morpho Blue markets';

  morphoAddress = '0xbbbbbbbbbb9cc5e90e3b3af64bdaf62c37eeffcb';
  subgraphUrl = 'https://api.thegraph.com/subgraphs/name/morpho-association/morpho-blue';
  whitelistedIds = MorphoBlueMarkets.whitelistedIds;
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(MorphoViemContractFactory) protected readonly contractFactory: MorphoViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.morphoBlue({ address, network: this.network });
  }

  async _fetchCollateralData(): Promise<MarketCollateralResponse> {
    return gqlFetch<MarketCollateralResponse>({
      endpoint: this.subgraphUrl,
      query: MorphoBlueMarkets.MARKET_COLLATERAL_QUERY,
      variables: { ids: MorphoBlueMarkets.whitelistedIds },
    });
  }

  async getDefinitions({ multicall }: GetDefinitionsParams) {
    const morphoBlue = this.contractFactory.morphoBlue({ address: this.morphoAddress, network: this.network });
    const morpho = multicall.wrap(morphoBlue);

    // Fetch all market data in parallel
    const marketData = await Promise.all(
      this.whitelistedIds.map(async id => {
        const [loanToken, collateralToken, oracle, irm, lltvBigInt] = await morpho.read.idToMarketParams([id]);
        const lltv = BigNumber.from(lltvBigInt);
        return { loanToken, collateralToken, oracle, irm, lltv };
      }),
    );

    // Map the fetched market data to your structure
    return marketData.map((data, i) => ({
      address: this.morphoAddress,
      marketId: this.whitelistedIds[i].toLowerCase(),
      loanTokenAddress: data.loanToken.toLowerCase(),
      collateralTokenAddress: data.collateralToken.toLowerCase(),
      irmAddress: data.irm.toLowerCase(),
      oracleAddress: data.oracle.toLowerCase(),
      lltv: data.lltv,
    }));
  }

  async getDataProps({
    contractPosition,
    multicall,
    definition: { marketId, loanTokenAddress, collateralTokenAddress, oracleAddress, irmAddress, lltv },
  }: GetDataPropsParams<MorphoBlue, MorphoContractPositionDataProps, MorphoContractPositionDefinition>) {
    const morpho = multicall.wrap(
      this.contractFactory.morphoBlue({ address: this.morphoAddress, network: this.network }),
    );

    const [totalSupplyAssets, totalSupplyShares, totalBorrowAssets, totalBorrowShares, lastUpdate, fee] =
      await morpho.read.market([marketId]);
    const _lltv: bigint = BigInt(Number(lltv));
    const irm = this.contractFactory.morphoAdaptiveCurve({ address: irmAddress, network: this.network });
    const borrowRate = await irm.read.borrowRateView([
      {
        loanToken: loanTokenAddress,
        collateralToken: collateralTokenAddress,
        oracle: oracleAddress,
        irm: irmAddress,
        lltv: _lltv,
      },
      {
        totalSupplyAssets,
        totalSupplyShares,
        totalBorrowAssets,
        totalBorrowShares,
        lastUpdate,
        fee,
      },
    ]);

    const borrowRateYear = BigNumber.from(borrowRate).mul(BigNumber.from(SECONDS_PER_YEAR));
    const WAD = MorphoBlueMath.WAD;
    const borrowApy: number = Number(
      +formatUnits(MorphoBlueMath.expN(borrowRateYear, 3, WAD).sub(BigNumber.from(1)), 18),
    );
    const utilization: BigNumber = BigNumber.from(totalBorrowAssets).div(BigNumber.from(totalSupplyAssets));

    const supplyRate = utilization.mul(BigNumber.from(borrowRate)).mul(BigNumber.from(1).sub(BigNumber.from(fee)));
    const supplyApy: number = +formatUnits(MorphoBlueMath.expN(supplyRate, 3, WAD).sub(BigNumber.from(1)), 18);
    const underlyingToken = contractPosition.tokens[0];
    const supply = +formatUnits(BigNumber.from(totalSupplyAssets), underlyingToken.decimals);
    const supplyUSD = supply * underlyingToken.price;
    const borrow = +formatUnits(BigNumber.from(totalBorrowAssets), underlyingToken.decimals);
    const borrowUSD = borrow * underlyingToken.price;
    const collateralData = await this._fetchCollateralData();
    const marketCollateral = collateralData.markets.find(market => market.id === marketId);
    let collateralSupply: number;

    if (!marketCollateral) {
      collateralSupply = +formatUnits(BigNumber.from(0), contractPosition.tokens[1].decimals);
    } else {
      collateralSupply = +formatUnits(
        BigNumber.from(marketCollateral.totalCollateral),
        contractPosition.tokens[1].decimals,
      ); // TO FINALIZE
    }

    const collateralSupplyUSD = collateralSupply * underlyingToken.price;
    const liquidity = supply * underlyingToken.price;

    return {
      marketId,
      supplyApy,
      borrowApy,
      liquidity,
      supply,
      supplyUSD,
      collateralSupply,
      collateralSupplyUSD,
      borrow,
      borrowUSD,
      borrowRate: BigNumber.from(borrowRate),
    };
  }

  private async _computeBalances(
    supplyShares: BigNumber,
    borrowShares: BigNumber,
    collateral: BigNumber,
    marketState: MarketState,
  ): Promise<BigNumber[]> {
    const supplyBalance = MorphoBlueMath.toAssetsDown(
      supplyShares,
      marketState.totalSupplyAssets,
      marketState.totalSupplyShares,
    );
    const collateralBalance = BigNumber.from(collateral);
    const borrowBalance = MorphoBlueMath.toAssetsDown(
      borrowShares,
      marketState.totalBorrowAssets,
      marketState.totalBorrowShares,
    );
    return [supplyBalance, collateralBalance, borrowBalance];
  }

  async getTokenBalancesPerPosition({
    address,
    contractPosition,
    multicall,
  }: GetTokenBalancesParams<MorphoBlue, MorphoContractPositionDataProps>) {
    const morpho = multicall.wrap(this.getContract(this.morphoAddress));

    const [supplyShares, borrowShares, collateral] = await morpho.read.position([
      contractPosition.dataProps.marketId,
      address,
    ]);

    const provider = this.appToolkit.getNetworkProvider(this.network);
    const blockNumber = await provider.getBlockNumber();
    const timestamp = (await provider.getBlock(blockNumber)).timestamp;

    const [totalSupplyAssets, totalSupplyShares, totalBorrowAssets, totalBorrowShares, lastUpdate, fee] =
      await morpho.read.market([contractPosition.dataProps.marketId]);

    const marketState: MarketState = {
      totalSupplyAssets: BigNumber.from(totalSupplyAssets),
      totalSupplyShares: BigNumber.from(totalSupplyShares),
      totalBorrowAssets: BigNumber.from(totalBorrowAssets),
      totalBorrowShares: BigNumber.from(totalBorrowShares),
      lastUpdate: BigNumber.from(lastUpdate),
      fee: BigNumber.from(fee),
    };

    const newMarketState = MorphoBlueMath.computeInterest(
      BigNumber.from(timestamp),
      marketState,
      contractPosition.dataProps.borrowRate,
    );
    // returns supply, collateral, borrow
    return this._computeBalances(
      BigNumber.from(supplyShares),
      BigNumber.from(borrowShares),
      BigNumber.from(collateral),
      newMarketState,
    );
  }
}
