import { Inject, Injectable } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { BLOCKS_PER_DAY } from '~app-toolkit/constants/blocks';
import {
  buildDollarDisplayItem,
  buildNumberDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MorphoCompound } from '~apps/morpho/contracts/ethers';
import { isMulticallUnderlyingError } from '~multicall/multicall.ethers';
import { StatsItem } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDefinitionsParams,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
  GetDataPropsParams,
  DefaultContractPositionDefinition,
} from '~position/template/contract-position.template.types';
import { Network } from '~types/network.interface';

import { MorphoContractFactory } from '../contracts';
import { MORPHO_DEFINITION } from '../morpho.definition';

export type MorphoCompoundContractPositionDefinition = {
  address: string;
  marketAddress: string;
  supplyTokenAddress: string;
};

export type MorphoCompoundContractPositionDataProps = {
  marketAddress: string;
  supplyApy: number;
  borrowApy: number;
  liquidity: number;
  p2pDisabled: boolean;
  supply: number;
  supplyUSD: number;
  borrow: number;
  borrowUSD: number;
};

@Injectable()
export class EthereumMorphoCompoundSupplyContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  MorphoCompound,
  MorphoCompoundContractPositionDataProps,
  MorphoCompoundContractPositionDefinition
> {
  appId = MORPHO_DEFINITION.id;
  groupId = MORPHO_DEFINITION.groups.morphoCompound.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'Morpho Compound';

  morphoAddress = '0x8888882f8f843896699869179fb6e4f7e3b58888';
  wEthAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(MorphoContractFactory) protected readonly contractFactory: MorphoContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): MorphoCompound {
    return this.contractFactory.morphoCompound({ address, network: this.network });
  }

  async getDefinitions({ multicall }: GetDefinitionsParams) {
    const morphoCompound = this.contractFactory.morphoCompound({ address: this.morphoAddress, network: this.network });

    const morpho = multicall.wrap(morphoCompound);
    const markets = await morpho.getAllMarkets();

    return Promise.all(
      markets.map(async marketAddress => {
        const market = this.contractFactory.morphoCToken({ address: marketAddress, network: this.network });
        const marketContract = multicall.wrap(market);
        const supplyTokenAddress = await marketContract.underlying().catch(err => {
          if (isMulticallUnderlyingError(err)) return this.wEthAddress;
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

  async getTokenDefinitions({
    definition,
  }: GetTokenDefinitionsParams<MorphoCompound, MorphoCompoundContractPositionDefinition>) {
    return [
      { metaType: MetaType.SUPPLIED, address: definition.supplyTokenAddress },
      { metaType: MetaType.BORROWED, address: definition.supplyTokenAddress },
    ];
  }

  async getDataProps({
    contractPosition,
    multicall,
    definition,
  }: GetDataPropsParams<
    MorphoCompound,
    MorphoCompoundContractPositionDataProps,
    MorphoCompoundContractPositionDefinition
  >): Promise<MorphoCompoundContractPositionDataProps> {
    const lensAddress = '0x930f1b46e1d081ec1524efd95752be3ece51ef67';
    const lens = this.contractFactory.morphoCompoundLens({ address: lensAddress, network: this.network });
    const lensContract = multicall.wrap(lens);
    const marketAddress = definition.marketAddress;

    const [supplyRateRaw, borrowRateRaw, totalMarketSupplyRaw, totalMarketBorrowRaw, marketConfiguration] =
      await Promise.all([
        lensContract.getAverageSupplyRatePerBlock(marketAddress),
        lensContract.getAverageBorrowRatePerBlock(marketAddress),
        lensContract.getTotalMarketSupply(marketAddress),
        lensContract.getTotalMarketBorrow(marketAddress),
        lensContract.getMarketConfiguration(marketAddress),
      ]);

    const blocksPerDay = BLOCKS_PER_DAY[this.network];
    const supplyRate = supplyRateRaw.avgSupplyRatePerBlock;
    const borrowRate = borrowRateRaw.avgBorrowRatePerBlock;
    const supplyApy = Math.pow(1 + (blocksPerDay * Number(supplyRate)) / Number(1e18), 365) - 1;
    const borrowApy = Math.pow(1 + (blocksPerDay * Number(borrowRate)) / Number(1e18), 365) - 1;
    const p2pDisabled = marketConfiguration.p2pDisabled;

    const underlyingToken = contractPosition.tokens[0];
    const supplyRaw = totalMarketSupplyRaw.p2pSupplyAmount.add(totalMarketSupplyRaw.poolSupplyAmount);
    const supply = Number(supplyRaw) / 10 ** underlyingToken.decimals;
    const supplyUSD = supply * underlyingToken.price;
    const borrowRaw = totalMarketBorrowRaw.p2pBorrowAmount.add(totalMarketBorrowRaw.poolBorrowAmount);
    const borrow = Number(borrowRaw) / 10 ** underlyingToken.decimals;
    const borrowUSD = borrow * underlyingToken.price;
    const liquidity = supply * underlyingToken.price;

    return { marketAddress, supplyApy, borrowApy, liquidity, p2pDisabled, supply, supplyUSD, borrow, borrowUSD };
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<MorphoCompound>) {
    return getLabelFromToken(contractPosition.tokens[0]);
  }

  async getImages({ contractPosition }: GetDisplayPropsParams<MorphoCompound>) {
    return getImagesFromToken(contractPosition.tokens[0]);
  }

  async getStatsItems({
    contractPosition,
  }: GetDisplayPropsParams<
    MorphoCompound,
    MorphoCompoundContractPositionDataProps,
    DefaultContractPositionDefinition
  >): Promise<StatsItem[] | undefined> {
    const { supplyApy, borrowApy, supply, supplyUSD, borrow, borrowUSD } = contractPosition.dataProps;

    return [
      { label: 'Supply APY', value: buildPercentageDisplayItem(supplyApy * 100) },
      { label: 'Total Supply', value: buildNumberDisplayItem(supply) },
      { label: 'Total Supply USD', value: buildDollarDisplayItem(supplyUSD) },
      { label: 'Borrow APY', value: buildPercentageDisplayItem(borrowApy * 100) },
      { label: 'Total Borrow', value: buildNumberDisplayItem(borrow) },
      { label: 'Total Borrow USD', value: buildDollarDisplayItem(borrowUSD) },
    ];
  }

  async getTokenBalancesPerPosition({
    address,
    contractPosition,
    multicall,
  }: GetTokenBalancesParams<MorphoCompound, MorphoCompoundContractPositionDataProps>): Promise<BigNumberish[]> {
    const lensAddress = '0x930f1b46e1d081ec1524efd95752be3ece51ef67';
    const _lens = this.contractFactory.morphoCompoundLens({ address: lensAddress, network: this.network });
    const lens = multicall.wrap(_lens);

    const supplyRaw = await lens.getCurrentSupplyBalanceInOf(contractPosition.dataProps.marketAddress, address);
    const borrowRaw = await lens.getCurrentBorrowBalanceInOf(contractPosition.dataProps.marketAddress, address);
    return [supplyRaw.totalBalance, borrowRaw.totalBalance];
  }
}
