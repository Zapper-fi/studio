import { Inject } from '@nestjs/common';
import _, { compact } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDefinitionsParams,
  GetTokenDefinitionsParams,
  GetDisplayPropsParams,
  GetDataPropsParams,
  GetTokenBalancesParams,
  DefaultContractPositionDefinition,
} from '~position/template/contract-position.template.types';

import { MetavaultTradeViemContractFactory } from '../contracts';
import { MetavaultTradeVault } from '../contracts/viem';

export type MetavaultTradeOptionContractPositionDefinition = {
  address: string;
  collateralTokenAddress: string;
  indexTokenAddress: string;
  isLong: boolean;
};

export type MetavaultTradeOptionContractPositionDataProps = {
  isLong: boolean;
  positionKey: string;
};

@PositionTemplate()
export class PolygonPerpContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  MetavaultTradeVault,
  MetavaultTradeOptionContractPositionDataProps,
  MetavaultTradeOptionContractPositionDefinition
> {
  groupLabel = 'Perpetuals';
  vaultAddress = '0x32848e2d3aecfa7364595609fb050a301050a6b4';
  usdcAddress = '0x2791bca1f2de4661ed88a30c99a7a9449aa84174';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(MetavaultTradeViemContractFactory) protected readonly contractFactory: MetavaultTradeViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.metavaultTradeVault({ address, network: this.network });
  }

  async getDefinitions({ multicall }: GetDefinitionsParams): Promise<MetavaultTradeOptionContractPositionDefinition[]> {
    const vaultContract = this.contractFactory.metavaultTradeVault({
      address: this.vaultAddress,
      network: this.network,
    });
    const tokensCount = await multicall.wrap(vaultContract).read.allWhitelistedTokensLength();
    const tokensRange = _.range(0, Number(tokensCount));

    const whitelistedTokens = await Promise.all(
      tokensRange.map(async tokenIndex =>
        multicall.wrap(vaultContract).read.allWhitelistedTokens([BigInt(tokenIndex)]),
      ),
    );

    const definitions = whitelistedTokens.flatMap(v =>
      whitelistedTokens.flatMap(t => {
        const long = { address: this.vaultAddress, indexTokenAddress: v, collateralTokenAddress: t, isLong: true };
        const short = { address: this.vaultAddress, indexTokenAddress: v, collateralTokenAddress: t, isLong: false };
        return [long, short];
      }),
    );

    return compact(definitions);
  }

  async getTokenDefinitions({
    definition,
  }: GetTokenDefinitionsParams<MetavaultTradeVault, MetavaultTradeOptionContractPositionDefinition>) {
    return [
      { metaType: MetaType.SUPPLIED, address: definition.collateralTokenAddress, network: this.network },
      { metaType: MetaType.SUPPLIED, address: definition.indexTokenAddress, network: this.network },
      { metaType: MetaType.SUPPLIED, address: this.usdcAddress, network: this.network },
    ];
  }

  async getDataProps({
    definition,
  }: GetDataPropsParams<
    MetavaultTradeVault,
    MetavaultTradeOptionContractPositionDataProps,
    MetavaultTradeOptionContractPositionDefinition
  >) {
    return { isLong: definition.isLong, positionKey: `${definition.isLong}` };
  }

  async getLabel({
    contractPosition,
  }: GetDisplayPropsParams<
    MetavaultTradeVault,
    MetavaultTradeOptionContractPositionDataProps,
    MetavaultTradeOptionContractPositionDefinition
  >): Promise<string> {
    const [collateralToken, indexToken] = contractPosition.tokens;
    const marketLabel = [indexToken, collateralToken].map(v => getLabelFromToken(v)).join(' / ');
    return `${contractPosition.dataProps.isLong ? 'Long' : 'Short'} ${marketLabel}`;
  }

  async getImages({
    contractPosition,
  }: GetDisplayPropsParams<
    MetavaultTradeVault,
    MetavaultTradeOptionContractPositionDataProps,
    DefaultContractPositionDefinition
  >) {
    const [collateralToken, indexToken] = contractPosition.tokens;
    return [indexToken, collateralToken].flatMap(v => getImagesFromToken(v));
  }

  async getTokenBalancesPerPosition({
    address,
    contractPosition,
    contract,
  }: GetTokenBalancesParams<MetavaultTradeVault, MetavaultTradeOptionContractPositionDataProps>) {
    const [collateralToken, indexToken, usdcToken] = contractPosition.tokens;
    const isLong = contractPosition.dataProps.isLong;

    const position = await contract.read.getPosition([address, collateralToken.address, indexToken.address, isLong]);
    // non existing position returns size and collateral = 0
    if (Number(position[0]) == 0 && Number(position[1]) == 0) return [0, 0, 0];

    // const leverage = await contract.read.getPositionLeverage([address, collateralToken.address, indexToken.address, isLong]);
    const delta = await contract.read.getPositionDelta([address, collateralToken.address, indexToken.address, isLong]);

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
