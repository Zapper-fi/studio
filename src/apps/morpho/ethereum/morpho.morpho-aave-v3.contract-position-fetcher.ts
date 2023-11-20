import { Inject } from '@nestjs/common';
import { BigNumber, constants } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  MorphoContractPositionDataProps,
  MorphoContractPositionDefinition,
  MorphoSupplyContractPositionFetcher,
} from '~apps/morpho/common/morpho.supply.contract-position-fetcher';
import { MorphoAaveV3 } from '~apps/morpho/contracts/viem';
import { MorphoAaveMath, SECONDS_PER_YEAR } from '~apps/morpho/utils/AaveV3.maths';
import P2PInterestRates from '~apps/morpho/utils/P2PInterestRates';
import {
  GetDataPropsParams,
  GetDefinitionsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';

import { MorphoViemContractFactory } from '../contracts';
import { PoolContract } from '../contracts/viem/Pool';

@PositionTemplate()
export class EthereumMorphoAaveV3SupplyContractPositionFetcher extends MorphoSupplyContractPositionFetcher<MorphoAaveV3> {
  groupLabel = 'Morpho AaveV3';
  __IRM__ = new P2PInterestRates();
  __MATH__ = new MorphoAaveMath();
  pool: PoolContract | null = null;

  morphoAddress = '0x33333aea097c193e66081e930c33020272b33333';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(MorphoViemContractFactory) protected readonly contractFactory: MorphoViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.morphoAaveV3({ address, network: this.network });
  }

  async getDefinitions({ multicall }: GetDefinitionsParams) {
    const morphoAaveV3 = this.contractFactory.morphoAaveV3({ address: this.morphoAddress, network: this.network });
    const morpho = multicall.wrap(morphoAaveV3);

    const [markets, pool] = await Promise.all([morpho.read.marketsCreated(), morpho.read.pool()]);
    this.pool = multicall.wrap(this.contractFactory.pool({ address: pool, network: this.network }));

    // Morpho AaveV3 uses underlyings as markets identifiers
    // @notice The function type forces to return a Promise
    return Promise.all(
      markets.map(async underlying => ({
        address: this.morphoAddress,
        pool: pool.toLowerCase(),
        marketAddress: underlying.toLowerCase(),
        supplyTokenAddress: underlying.toLowerCase(),
      })),
    );
  }

  async getDataProps({
    contractPosition,
    multicall,
    definition: { marketAddress },
  }: GetDataPropsParams<MorphoAaveV3, MorphoContractPositionDataProps, MorphoContractPositionDefinition>) {
    const morpho = multicall.wrap(
      this.contractFactory.morphoAaveV3({ address: this.morphoAddress, network: this.network }),
    );

    const [
      {
        idleSupply,
        indexes,
        deltas,
        p2pIndexCursor,
        reserveFactor,
        aToken: aTokenAddress,
        variableDebtToken: variableDebtTokenAddress,
        pauseStatuses: { isP2PDisabled },
      },
      { currentLiquidityRate, currentVariableBorrowRate, liquidityIndex, variableBorrowIndex },
    ] = await Promise.all([morpho.read.market([marketAddress]), this.pool!.read.getReserveData([marketAddress])]);

    const aToken = multicall.wrap(this.contractFactory.morphoAToken({ address: aTokenAddress, network: this.network }));
    const variableDebtToken = multicall.wrap(
      this.contractFactory.morphoAToken({ address: variableDebtTokenAddress, network: this.network }),
    );

    const [supplyOnPool, borrowOnPool] = await Promise.all([
      aToken.read.balanceOf([this.morphoAddress]),
      variableDebtToken.read.balanceOf([this.morphoAddress]),
    ]);

    const minBN = (a: BigNumber, b: BigNumber) => (a.lt(b) ? a : b);
    const proportionIdle =
      idleSupply === BigInt(0)
        ? constants.Zero
        : minBN(
            // To avoid proportionIdle > 1 with rounding errors
            this.__MATH__.ONE,
            this.__MATH__.indexDiv(
              idleSupply,
              this.__MATH__.indexMul(deltas.supply.scaledP2PTotal, indexes.supply.p2pIndex),
            ),
          );

    const { newP2PSupplyIndex, newP2PBorrowIndex } = this.__IRM__.computeP2PIndexes({
      deltas,
      proportionIdle,
      p2pIndexCursor: BigNumber.from(p2pIndexCursor),
      reserveFactor: BigNumber.from(reserveFactor),
      lastBorrowIndexes: {
        poolIndex: BigNumber.from(indexes.borrow.poolIndex),
        p2pIndex: BigNumber.from(indexes.borrow.p2pIndex),
      },
      lastSupplyIndexes: {
        poolIndex: BigNumber.from(indexes.supply.poolIndex),
        p2pIndex: BigNumber.from(indexes.supply.p2pIndex),
      },
      poolBorrowIndex: BigNumber.from(variableBorrowIndex),
      poolSupplyIndex: BigNumber.from(liquidityIndex),
    });

    const supplyInP2P = this.__MATH__.indexMul(deltas.supply.scaledP2PTotal, newP2PSupplyIndex);
    const borrowInP2P = this.__MATH__.indexMul(deltas.borrow.scaledP2PTotal, newP2PBorrowIndex);
    const totalSupply = supplyInP2P.add(supplyOnPool);
    const totalBorrow = borrowInP2P.add(borrowOnPool);

    // Compute the rates weighted by proportion in p2p and on pool
    const p2pSupplyRate = this.__IRM__.computeP2PSupplyRatePerYear({
      p2pIndex: newP2PSupplyIndex,
      proportionIdle,
      p2pIndexCursor: BigNumber.from(p2pIndexCursor),
      reserveFactor: BigNumber.from(reserveFactor),
      delta: deltas.supply,
      poolBorrowRatePerYear: BigNumber.from(currentVariableBorrowRate),
      poolSupplyRatePerYear: BigNumber.from(currentLiquidityRate),
      poolIndex: BigNumber.from(liquidityIndex),
    });

    const p2pBorrowRate = this.__IRM__.computeP2PBorrowRatePerYear({
      p2pIndex: newP2PBorrowIndex,
      poolSupplyRatePerYear: BigNumber.from(currentLiquidityRate),
      poolIndex: BigNumber.from(variableBorrowIndex),
      poolBorrowRatePerYear: BigNumber.from(currentVariableBorrowRate),
      delta: deltas.borrow,
      reserveFactor: BigNumber.from(reserveFactor),
      p2pIndexCursor: BigNumber.from(p2pIndexCursor),
      proportionIdle,
    });

    const supplyRate = totalSupply.isZero()
      ? BigNumber.from(currentLiquidityRate)
      : p2pSupplyRate.mul(supplyInP2P).add(BigNumber.from(currentLiquidityRate).mul(supplyOnPool)).div(totalSupply);
    const borrowRate = totalBorrow.isZero()
      ? BigNumber.from(currentVariableBorrowRate)
      : p2pBorrowRate
          .mul(borrowInP2P)
          .add(BigNumber.from(currentVariableBorrowRate).mul(borrowOnPool))
          .div(totalBorrow);

    const supplyApy = Math.pow(1 + +formatUnits(supplyRate.div(SECONDS_PER_YEAR), 27), SECONDS_PER_YEAR) - 1;
    const borrowApy = Math.pow(1 + +formatUnits(borrowRate.div(SECONDS_PER_YEAR), 27), SECONDS_PER_YEAR) - 1;

    const underlyingToken = contractPosition.tokens[0];
    const supply = +formatUnits(totalSupply, underlyingToken.decimals);
    const supplyUSD = supply * underlyingToken.price;
    const matchedUSD = +formatUnits(borrowInP2P, underlyingToken.decimals) * underlyingToken.price;
    const borrow = +formatUnits(totalBorrow, underlyingToken.decimals);
    const borrowUSD = borrow * underlyingToken.price;
    const liquidity = supply * underlyingToken.price;

    return {
      marketAddress,
      supplyApy,
      borrowApy,
      liquidity,
      p2pDisabled: isP2PDisabled,
      supply,
      supplyUSD,
      borrow,
      borrowUSD,
      matchedUSD,
    };
  }

  async getTokenBalancesPerPosition({
    address,
    contractPosition,
    multicall,
  }: GetTokenBalancesParams<MorphoAaveV3, MorphoContractPositionDataProps>) {
    const morpho = multicall.wrap(this.getContract(this.morphoAddress));

    const [supplyBalance, collateralBalance, borrowBalance] = await Promise.all([
      morpho.read.supplyBalance([contractPosition.dataProps.marketAddress, address]),
      morpho.read.collateralBalance([contractPosition.dataProps.marketAddress, address]),
      morpho.read.borrowBalance([contractPosition.dataProps.marketAddress, address]),
    ]);

    return [BigNumber.from(supplyBalance).add(collateralBalance), BigNumber.from(borrowBalance)];
  }
}
