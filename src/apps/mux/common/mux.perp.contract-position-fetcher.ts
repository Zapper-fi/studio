import { Inject } from '@nestjs/common';
import { BigNumber, BigNumberish } from 'ethers';
import _ from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import {
  computePositionPnlUsd,
  encodeSubAccountId,
  fromWei,
  getCollateralTokensByNetwork,
  getMarketTokensByNetwork,
} from '~apps/mux/common/utils';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { MuxViemContractFactory } from '../contracts';
import { MuxVault } from '../contracts/viem/MuxVault';

export type MuxPerpContractPositionDefinition = {
  address: string;
  collateralTokenAddress: string;
  collateralTokenId: number;
  indexTokenAddress: string;
  indexTokenId: number;
  isLong: boolean;
  indexTokenMinProfitRate: string;
  indexTokenMinProfitTime: number;
};

export type MuxPerpContractPositionDataProps = {
  isLong: boolean;
  positionKey: string;
  collateralTokenId: number;
  indexTokenId: number;
  indexTokenMinProfitRate: string;
  indexTokenMinProfitTime: number;
};

export abstract class MuxPerpContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  MuxVault,
  MuxPerpContractPositionDataProps,
  MuxPerpContractPositionDefinition
> {
  abstract readerAddress: string;
  abstract usdcAddress: string;
  abstract vaultAddress: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(MuxViemContractFactory) protected readonly contractFactory: MuxViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.muxVault({ address, network: this.network });
  }

  async getDefinitions() {
    const indexTokenList = await getMarketTokensByNetwork(this.network, this.appToolkit);
    const collateralTokensList = await getCollateralTokensByNetwork(this.network, this.appToolkit);

    const definitions = collateralTokensList.flatMap(collateralToken => {
      return indexTokenList.flatMap(indexToken => {
        const collateralTokenAddress = collateralToken.address;
        const collateralTokenId = collateralToken.muxTokenId;
        const indexTokenAddress = indexToken.address;
        const indexTokenId = indexToken.muxTokenId;
        const indexTokenMinProfitRate = indexToken.minProfitRate.toFixed(0);
        const indexTokenMinProfitTime = indexToken.minProfitTime;

        const long = {
          address: this.vaultAddress,
          collateralTokenAddress,
          collateralTokenId,
          indexTokenAddress,
          indexTokenId,
          indexTokenMinProfitRate,
          indexTokenMinProfitTime,
          isLong: true,
        };

        const short = {
          address: this.vaultAddress,
          collateralTokenAddress,
          collateralTokenId,
          indexTokenAddress,
          indexTokenId,
          indexTokenMinProfitRate,
          indexTokenMinProfitTime,
          isLong: false,
        };

        return [long, short];
      });
    });

    return _.compact(definitions);
  }

  async getTokenDefinitions({ definition }: GetTokenDefinitionsParams<MuxVault, MuxPerpContractPositionDefinition>) {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: definition.collateralTokenAddress,
        network: this.network,
      },
      {
        metaType: MetaType.SUPPLIED,
        address: definition.indexTokenAddress,
        network: this.network,
      },
      {
        metaType: MetaType.SUPPLIED,
        address: this.usdcAddress,
        network: this.network,
      },
    ];
  }

  async getDataProps({
    definition,
  }: GetDataPropsParams<MuxVault, MuxPerpContractPositionDataProps, MuxPerpContractPositionDefinition>) {
    return {
      isLong: definition.isLong,
      indexTokenId: definition.indexTokenId,
      collateralTokenId: definition.collateralTokenId,
      indexTokenMinProfitRate: definition.indexTokenMinProfitRate,
      indexTokenMinProfitTime: definition.indexTokenMinProfitTime,
      positionKey: `${definition.isLong}`,
    };
  }

  async getLabel({
    contractPosition,
  }: GetDisplayPropsParams<MuxVault, MuxPerpContractPositionDataProps, MuxPerpContractPositionDefinition>) {
    const [collateralToken, indexToken] = contractPosition.tokens;
    const marketLabel = [indexToken, collateralToken].map(v => getLabelFromToken(v)).join(' / ');
    return `${contractPosition.dataProps.isLong ? 'Long' : 'Short'} ${marketLabel}`;
  }

  async getTokenBalancesPerPosition({
    address,
    contractPosition,
    multicall,
  }: GetTokenBalancesParams<MuxVault, MuxPerpContractPositionDataProps>): Promise<BigNumberish[]> {
    const { collateralTokenId, indexTokenId, isLong } = contractPosition.dataProps;
    const [collateralToken, indexToken, usdcToken] = contractPosition.tokens;

    const subAccountId = encodeSubAccountId(address, collateralTokenId, indexTokenId, isLong);
    if (!subAccountId) return [0, 0, 0];

    const reader = this.contractFactory.muxReader({ address: this.readerAddress, network: this.network });
    const subAccounts = await multicall.wrap(reader).read.getSubAccounts([[subAccountId]]);
    const [{ collateral, size, entryPrice, lastIncreasedTime }] = subAccounts;

    const { pnlUsd } = computePositionPnlUsd(
      indexToken.price,
      contractPosition.dataProps.indexTokenMinProfitTime,
      contractPosition.dataProps.indexTokenMinProfitRate,
      fromWei(BigNumber.from(size)),
      fromWei(BigNumber.from(entryPrice)),
      lastIncreasedTime,
      isLong,
    );

    const collateralAmount = fromWei(BigNumber.from(collateral));
    if (Number(collateralAmount) == 0) return [0, 0, 0];

    const collateralAmountUsd = collateralAmount.times(collateralToken.price);

    const hasProfit = Number(pnlUsd) > 0;
    const profitToken = isLong ? indexToken : usdcToken;

    const collateralBalanceRaw = hasProfit
      ? collateralAmount
      : collateralAmountUsd.plus(pnlUsd).div(collateralToken.price);
    const collateralBalance = collateralBalanceRaw.shiftedBy(collateralToken.decimals).toFixed(0);

    const profitTokenBalanceRaw = pnlUsd.div(profitToken.price);
    const profitTokenBalance = profitTokenBalanceRaw.shiftedBy(profitToken.decimals).toFixed(0);

    return isLong ? [collateralBalance, profitTokenBalance, 0] : [collateralBalance, 0, profitTokenBalance];
  }
}
