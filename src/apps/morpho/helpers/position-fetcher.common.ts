import { BigNumberish, Contract } from 'ethers';

import {
  buildDollarDisplayItem,
  buildNumberDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { StatsItem } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  DefaultContractPositionDefinition,
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

export type MorphoContractPositionDefinition = {
  address: string;
  marketAddress: string;
  supplyTokenAddress: string;
};

export type MorphoContractPositionDataProps = {
  marketAddress: string;
  supplyApy: number;
  borrowApy: number;
  liquidity: number;
  p2pDisabled: boolean;
  supply: number;
  supplyUSD: number;
  borrow: number;
  borrowUSD: number;
  matchedUSD: number;
};
export abstract class BaseEthereumMorphoSupplyContractPositionFetcher<
  T extends Contract,
> extends ContractPositionTemplatePositionFetcher<
  T,
  MorphoContractPositionDataProps,
  MorphoContractPositionDefinition
> {
  abstract getDataProps(
    params: GetDataPropsParams<T, MorphoContractPositionDataProps, MorphoContractPositionDefinition>,
  ): Promise<MorphoContractPositionDataProps>;

  abstract getContract(address: string): T;

  async getLabel({ contractPosition }: GetDisplayPropsParams<T>): Promise<string> {
    return getLabelFromToken(contractPosition.tokens[0]);
  }

  async getImages({ contractPosition }: GetDisplayPropsParams<T>): Promise<string[]> {
    return getImagesFromToken(contractPosition.tokens[0]);
  }

  async getStatsItems({
    contractPosition,
  }: GetDisplayPropsParams<T, MorphoContractPositionDataProps, DefaultContractPositionDefinition>): Promise<
    StatsItem[] | undefined
  > {
    const { supplyApy, borrowApy, supply, supplyUSD, borrow, borrowUSD, matchedUSD } = contractPosition.dataProps;

    return [
      { label: 'Supply APY', value: buildPercentageDisplayItem(supplyApy * 100) },
      { label: 'Total Supply', value: buildNumberDisplayItem(supply) },
      { label: 'Total Supply USD', value: buildDollarDisplayItem(supplyUSD) },
      { label: 'Borrow APY', value: buildPercentageDisplayItem(borrowApy * 100) },
      { label: 'Total Borrow', value: buildNumberDisplayItem(borrow) },
      { label: 'Total Borrow USD', value: buildDollarDisplayItem(borrowUSD) },
      { label: 'Total USD Value Matched P2P', value: buildDollarDisplayItem(matchedUSD) },
    ];
  }

  abstract getTokenBalancesPerPosition(
    params: GetTokenBalancesParams<T, MorphoContractPositionDataProps>,
  ): Promise<BigNumberish[]>;
  async getTokenDefinitions({ definition }: GetTokenDefinitionsParams<T, MorphoContractPositionDefinition>) {
    return [
      { metaType: MetaType.SUPPLIED, address: definition.supplyTokenAddress },
      { metaType: MetaType.BORROWED, address: definition.supplyTokenAddress },
    ];
  }
}
