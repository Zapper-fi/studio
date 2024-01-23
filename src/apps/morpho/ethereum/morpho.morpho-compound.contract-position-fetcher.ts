import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { BLOCKS_PER_DAY } from '~app-toolkit/constants/blocks';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  MorphoContractPositionDataProps,
  MorphoContractPositionDefinition,
  MorphoSupplyContractPositionFetcher,
} from '~apps/morpho/common/morpho.supply.contract-position-fetcher';
import { MorphoCompound } from '~apps/morpho/contracts/viem';
import { isViemMulticallUnderlyingError } from '~multicall/errors';
import {
  GetDataPropsParams,
  GetDefinitionsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';

import { MorphoViemContractFactory } from '../contracts';

@PositionTemplate()
export class EthereumMorphoCompoundSupplyContractPositionFetcher extends MorphoSupplyContractPositionFetcher<MorphoCompound> {
  groupLabel = 'Morpho Compound';

  morphoAddress = '0x8888882f8f843896699869179fb6e4f7e3b58888';
  lensAddress = '0x930f1b46e1d081ec1524efd95752be3ece51ef67';
  wEthAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(MorphoViemContractFactory) protected readonly contractFactory: MorphoViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.morphoCompound({ address, network: this.network });
  }

  async getDefinitions({ multicall }: GetDefinitionsParams) {
    const morphoCompound = this.contractFactory.morphoCompound({ address: this.morphoAddress, network: this.network });

    const morpho = multicall.wrap(morphoCompound);
    const markets = await morpho.read.getAllMarkets().then(v => [...v]);

    return Promise.all(
      markets.map(async marketAddress => {
        const market = this.contractFactory.morphoCToken({ address: marketAddress, network: this.network });
        const marketContract = multicall.wrap(market);
        const supplyTokenAddress = await marketContract.read.underlying().catch(err => {
          if (isViemMulticallUnderlyingError(err)) return this.wEthAddress;
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

  async getDataProps({
    contractPosition,
    multicall,
    definition,
  }: GetDataPropsParams<MorphoCompound, MorphoContractPositionDataProps, MorphoContractPositionDefinition>) {
    const lens = this.contractFactory.morphoCompoundLens({ address: this.lensAddress, network: this.network });
    const lensContract = multicall.wrap(lens);
    const marketAddress = definition.marketAddress;

    const [supplyRateRaw, borrowRateRaw, totalMarketSupplyRaw, totalMarketBorrowRaw, marketConfiguration] =
      await Promise.all([
        lensContract.read.getAverageSupplyRatePerBlock([marketAddress]),
        lensContract.read.getAverageBorrowRatePerBlock([marketAddress]),
        lensContract.read.getTotalMarketSupply([marketAddress]),
        lensContract.read.getTotalMarketBorrow([marketAddress]),
        lensContract.read.getMarketConfiguration([marketAddress]),
      ]);

    const blocksPerDay = BLOCKS_PER_DAY[this.network];
    const supplyRate = supplyRateRaw[0];
    const borrowRate = borrowRateRaw[0];
    const supplyApy = Math.pow(1 + (blocksPerDay * Number(supplyRate)) / Number(1e18), 365) - 1;
    const borrowApy = Math.pow(1 + (blocksPerDay * Number(borrowRate)) / Number(1e18), 365) - 1;
    const p2pDisabled = marketConfiguration[2];

    const underlyingToken = contractPosition.tokens[0];
    const supplyRaw = BigNumber.from(totalMarketSupplyRaw[0]).add(totalMarketSupplyRaw[1]);
    const supply = Number(supplyRaw) / 10 ** underlyingToken.decimals;
    const supplyUSD = supply * underlyingToken.price;
    const liquidity = supply * underlyingToken.price;

    const borrowRaw = BigNumber.from(totalMarketBorrowRaw[0]).add(totalMarketBorrowRaw[1]);
    const matchedUSD = +formatUnits(borrowRaw, underlyingToken.decimals) * underlyingToken.price;
    const borrow = Number(borrowRaw) / 10 ** underlyingToken.decimals;
    const borrowUSD = borrow * underlyingToken.price;

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

  async getTokenBalancesPerPosition({
    address,
    contractPosition,
    multicall,
  }: GetTokenBalancesParams<MorphoCompound, MorphoContractPositionDataProps>) {
    const lensAddress = '0x930f1b46e1d081ec1524efd95752be3ece51ef67';
    const _lens = this.contractFactory.morphoCompoundLens({ address: lensAddress, network: this.network });
    const lens = multicall.wrap(_lens);

    const supplyRaw = await lens.read.getCurrentSupplyBalanceInOf([contractPosition.dataProps.marketAddress, address]);
    const borrowRaw = await lens.read.getCurrentBorrowBalanceInOf([contractPosition.dataProps.marketAddress, address]);
    return [supplyRaw[2], borrowRaw[2]];
  }
}
