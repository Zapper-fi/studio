import { Inject, Injectable } from '@nestjs/common';
import _, { compact } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractPosition, MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDefinitionsParams,
  GetTokenDefinitionsParams,
  GetDisplayPropsParams,
  GetDataPropsParams,
  GetTokenBalancesParams,
  DefaultContractPositionDefinition,
} from '~position/template/contract-position.template.types';

import { GmxContractFactory, GmxVault } from '../contracts';

export type GmxOptionContractPositionDefinition = {
  address: string;
  collateralTokenAddress: string;
  indexTokenAddress: string;
  isLong: boolean;
};

export type GmxOptionContractPositionDataProps = {
  isLong: boolean;
};

@Injectable()
export abstract class GmxPerpContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  GmxVault,
  GmxOptionContractPositionDataProps,
  GmxOptionContractPositionDefinition
> {
  abstract vaultAddress: string;
  abstract usdcAddress: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(GmxContractFactory) protected readonly contractFactory: GmxContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): GmxVault {
    return this.contractFactory.gmxVault({ address, network: this.network });
  }

  async getDefinitions({ multicall }: GetDefinitionsParams): Promise<GmxOptionContractPositionDefinition[]> {
    const vaultContract = this.contractFactory.gmxVault({ address: this.vaultAddress, network: this.network });
    const tokensCount = await multicall.wrap(vaultContract).allWhitelistedTokensLength();
    const tokensRange = _.range(0, Number(tokensCount));

    const whitelistedTokens = await Promise.all(
      tokensRange.map(async tokenIndex => multicall.wrap(vaultContract).allWhitelistedTokens(tokenIndex)),
    );

    const definitions = whitelistedTokens.flatMap(v =>
      whitelistedTokens.flatMap(t => {
        if (v === t) return null;
        const long = { address: this.vaultAddress, indexTokenAddress: v, collateralTokenAddress: t, isLong: true };
        const short = { address: this.vaultAddress, indexTokenAddress: v, collateralTokenAddress: t, isLong: true };
        return [long, short];
      }),
    );

    return compact(definitions);
  }

  async getTokenDefinitions({ definition }: GetTokenDefinitionsParams<GmxVault, GmxOptionContractPositionDefinition>) {
    return [
      { metaType: MetaType.SUPPLIED, address: definition.collateralTokenAddress, network: this.network },
      { metaType: MetaType.SUPPLIED, address: definition.indexTokenAddress, network: this.network },
      { metaType: MetaType.SUPPLIED, address: this.usdcAddress, network: this.network },
    ];
  }

  async getDataProps({
    definition,
  }: GetDataPropsParams<GmxVault, GmxOptionContractPositionDataProps, GmxOptionContractPositionDefinition>) {
    return { isLong: definition.isLong };
  }

  async getLabel({
    contractPosition,
  }: GetDisplayPropsParams<
    GmxVault,
    GmxOptionContractPositionDataProps,
    GmxOptionContractPositionDefinition
  >): Promise<string> {
    const [collateralToken, indexToken] = contractPosition.tokens;
    const marketLabel = [indexToken, collateralToken].map(v => getLabelFromToken(v)).join(' / ');
    return `${contractPosition.dataProps.isLong ? 'Long' : 'Short'} ${marketLabel}`;
  }

  async getImages({
    contractPosition,
  }: GetDisplayPropsParams<GmxVault, GmxOptionContractPositionDataProps, DefaultContractPositionDefinition>) {
    const [collateralToken, indexToken] = contractPosition.tokens;
    return [indexToken, collateralToken].flatMap(v => getImagesFromToken(v));
  }

  getKey({ contractPosition }: { contractPosition: ContractPosition<GmxOptionContractPositionDataProps> }) {
    return this.appToolkit.getPositionKey(contractPosition, ['isLong']);
  }

  async getTokenBalancesPerPosition({
    address,
    contractPosition,
    contract,
  }: GetTokenBalancesParams<GmxVault, GmxOptionContractPositionDataProps>) {
    const [collateralToken, indexToken, usdcToken] = contractPosition.tokens;
    const isLong = contractPosition.dataProps.isLong;

    const position = await contract.getPosition(address, collateralToken.address, indexToken.address, isLong);
    // non existing position returns size and collateral = 0
    if (Number(position[0]) == 0 && Number(position[1]) == 0) return [0, 0, 0];

    // const leverage = await contract.getPositionLeverage(address, collateralToken.address, indexToken.address, isLong);
    const delta = await contract.getPositionDelta(address, collateralToken.address, indexToken.address, isLong);

    const initialCollateralRaw = position[1];
    const initialCollateral = Number(initialCollateralRaw) / 10 ** 30;
    const deltaBalanceRaw = delta[1];
    const deltaBalance = Number(deltaBalanceRaw) / 10 ** 30;

    const hasProfit = delta[0];
    const balanceUSD = hasProfit == true ? initialCollateral + deltaBalance : initialCollateral - deltaBalance;

    const profitToken = isLong ? indexToken : usdcToken;
    const balanceInProfitToken = balanceUSD / profitToken.price;
    const balanceInProfitTokenRaw = balanceInProfitToken * 10 ** profitToken.decimals;
    return isLong ? [0, balanceInProfitTokenRaw, 0] : [0, 0, balanceInProfitTokenRaw];
  }
}
