import { BigNumber, BigNumberish } from 'ethers';
import { Abi, GetContractReturnType, PublicClient } from 'viem';

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
  marketId: string;
  loanTokenAddress: string;
  collateralTokenAddress: string;
  oracleAddress: string;
  irmAddress: string;
  lltv: BigNumber;
};

export type MorphoContractPositionDataProps = {
  marketId: string;
  supplyApy: number;
  borrowApy: number;
  liquidity: number;
  supply: number;
  supplyUSD: number;
  collateralSupply: number;
  collateralSupplyUSD: number;
  borrow: number;
  borrowUSD: number;
  borrowRate: BigNumber;
};

export abstract class MorphoSupplyContractPositionFetcher<
  T extends Abi,
> extends ContractPositionTemplatePositionFetcher<
  T,
  MorphoContractPositionDataProps,
  MorphoContractPositionDefinition
> {
  abstract getDataProps(
    params: GetDataPropsParams<T, MorphoContractPositionDataProps, MorphoContractPositionDefinition>,
  ): Promise<MorphoContractPositionDataProps>;

  abstract getContract(address: string): GetContractReturnType<T, PublicClient>;

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
    const {
      marketId,
      supplyApy,
      borrowApy,
      supply,
      supplyUSD,
      collateralSupply,
      collateralSupplyUSD,
      borrow,
      borrowUSD,
    } = contractPosition.dataProps;

    return [
      { label: 'Market Id', value: marketId },
      { label: 'Supply APY', value: buildPercentageDisplayItem(supplyApy * 100) },
      { label: 'Total Supply', value: buildNumberDisplayItem(supply) },
      { label: 'Total Supply USD', value: buildDollarDisplayItem(supplyUSD) },
      { label: 'Total Collateral', value: buildNumberDisplayItem(collateralSupply) },
      { label: 'Total Collateral Supply USD', value: buildDollarDisplayItem(collateralSupplyUSD) },
      { label: 'Borrow APY', value: buildPercentageDisplayItem(borrowApy * 100) },
      { label: 'Total Borrow', value: buildNumberDisplayItem(borrow) },
      { label: 'Total Borrow USD', value: buildDollarDisplayItem(borrowUSD) },
    ];
  }

  abstract getTokenBalancesPerPosition(
    params: GetTokenBalancesParams<T, MorphoContractPositionDataProps>,
  ): Promise<BigNumberish[]>;
  async getTokenDefinitions({ definition }: GetTokenDefinitionsParams<T, MorphoContractPositionDefinition>) {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: definition.loanTokenAddress,
        network: this.network,
      },
      {
        metaType: MetaType.SUPPLIED,
        address: definition.collateralTokenAddress,
        network: this.network,
      },
      {
        metaType: MetaType.BORROWED,
        address: definition.loanTokenAddress,
        network: this.network,
      },
    ];
  }
}
