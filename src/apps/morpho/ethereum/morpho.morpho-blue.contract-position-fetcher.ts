import { Inject } from '@nestjs/common';
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

import { MulDiv, expN, getConvertToAssets, mulDivDown } from 'evm-maths/lib/utils';
import { WAD } from 'evm-maths/lib/constants';

import { MorphoBlueMath } from '../utils/morpho-blue/Blue.maths';
import { MarketState } from '../utils/morpho-blue/interfaces';
import { MorphoBlueMarkets, MarketCollateralResponse } from '../utils/morpho-blue/markets';
import { wadDivDown, wadMulDown } from 'evm-maths/lib/wad';

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
    const marketData = await Promise.all(
      this.whitelistedIds.map(async id => {
        const [loanToken, collateralToken, oracle, irm, lltv] = await morpho.read.idToMarketParams([id]);
        return { loanToken, collateralToken, oracle, irm, lltv };
      }),
    );
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
    const irm = this.contractFactory.morphoBlueIrm({ address: irmAddress, network: this.network });
    const borrowRate = await irm.read.borrowRateView([
      {
        loanToken: loanTokenAddress,
        collateralToken: collateralTokenAddress,
        oracle: oracleAddress,
        irm: irmAddress,
        lltv: lltv,
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

    const borrowRateYear = borrowRate * BigInt(SECONDS_PER_YEAR);
    const borrowApy: number = +formatUnits(MorphoBlueMath.wTaylorCompounded(borrowRateYear, BigInt(1)), 18);

    const utilization: bigint =
      totalSupplyAssets != BigInt(0) ? wadDivDown(totalBorrowAssets, totalSupplyAssets) : BigInt(1);

    const supplyRate = wadMulDown(wadMulDown(utilization, borrowRateYear), BigInt(WAD) - BigInt(fee));
    const supplyApy: number = +formatUnits(MorphoBlueMath.wTaylorCompounded(supplyRate, BigInt(1)), 18);

    const underlyingToken = contractPosition.tokens[0];
    const collateralToken = contractPosition.tokens[1];
    const supply = +formatUnits(totalSupplyAssets, underlyingToken.decimals);
    const supplyUSD = supply * underlyingToken.price;
    const borrow = +formatUnits(totalBorrowAssets, underlyingToken.decimals);
    const borrowUSD = borrow * underlyingToken.price;
    const collateralData = await this._fetchCollateralData();
    const marketCollateral = collateralData.markets.find(market => market.id === marketId);
    let collateralSupply: number;

    if (!marketCollateral) {
      collateralSupply = +formatUnits(BigInt(0), contractPosition.tokens[1].decimals);
    } else {
      collateralSupply = +formatUnits(BigInt(marketCollateral.totalCollateral), contractPosition.tokens[1].decimals);
    }

    const collateralSupplyUSD = collateralSupply * collateralToken.price;
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
      borrowRate,
    };
  }

  private async _computeBalances(
    supplyShares: bigint,
    borrowShares: bigint,
    collateral: bigint,
    marketState: MarketState,
  ): Promise<bigint[]> {
    const virtualAssets = MorphoBlueMath.VIRTUAL_ASSETS;
    const virtualShares = MorphoBlueMath.VIRTUAL_SHARES;
    const convertToAssetsFunction = getConvertToAssets(virtualAssets, virtualShares, MorphoBlueMath.mulDivDown);
    const supplyBalance = convertToAssetsFunction(
      supplyShares,
      marketState.totalSupplyAssets,
      marketState.totalSupplyShares,
    );
    const borrowBalance = convertToAssetsFunction(
      borrowShares,
      marketState.totalBorrowAssets,
      marketState.totalBorrowShares,
    );
    return [supplyBalance, collateral, borrowBalance];
  }

  async getTokenBalancesPerPosition({
    address,
    contractPosition,
    multicall,
  }: GetTokenBalancesParams<MorphoBlue, MorphoContractPositionDataProps>) {
    const morpho = multicall.wrap(
      this.contractFactory.morphoBlue({ address: this.morphoAddress, network: this.network }),
    );
    const [supplyShares, borrowShares, collateral] = await morpho.read.position([
      contractPosition.dataProps.marketId,
      address,
    ]);

    const provider = this.appToolkit.getNetworkProvider(this.network);
    const blockNumber = await provider.getBlockNumber();
    const timestampPromise = provider.getBlock(blockNumber).then(block => block.timestamp);

    const [timestamp, [totalSupplyAssets, totalSupplyShares, totalBorrowAssets, totalBorrowShares, lastUpdate, fee]] =
      await Promise.all([timestampPromise, await morpho.read.market([contractPosition.dataProps.marketId])]);

    const marketState: MarketState = {
      totalSupplyAssets,
      totalSupplyShares,
      totalBorrowAssets,
      totalBorrowShares,
      lastUpdate,
      fee,
    };

    const newMarketState = MorphoBlueMath.computeInterest(
      BigInt(timestamp),
      marketState,
      contractPosition.dataProps.borrowRate,
    );

    return this._computeBalances(supplyShares, borrowShares, collateral, newMarketState);
  }
}
