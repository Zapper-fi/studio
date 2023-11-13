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

import { MyceliumViemContractFactory } from '../contracts';
import { MyceliumVault } from '../contracts/viem';

export type MyceliumPerpContractPositionDefinition = {
  address: string;
  collateralTokenAddress: string;
  indexTokenAddress: string;
  isLong: boolean;
};

export type MyceliumPerpContractPositionDataProps = {
  isLong: boolean;
  positionKey: string;
};

@PositionTemplate()
export class ArbitrumMycellilumPerpContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  MyceliumVault,
  MyceliumPerpContractPositionDataProps,
  MyceliumPerpContractPositionDefinition
> {
  groupLabel = 'Perpetuals';
  vaultAddress = '0xdfba8ad57d2c62f61f0a60b2c508bcdeb182f855';
  usdcAddress = '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(MyceliumViemContractFactory) protected readonly contractFactory: MyceliumViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.myceliumVault({ address, network: this.network });
  }

  async getDefinitions({ multicall }: GetDefinitionsParams): Promise<MyceliumPerpContractPositionDefinition[]> {
    const vaultContract = this.contractFactory.myceliumVault({
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

    const definitions = whitelistedTokens.flatMap(indexTokenAddress =>
      whitelistedTokens.flatMap(collateralTokenAddress => {
        if (indexTokenAddress === collateralTokenAddress) return [];
        const long = { address: this.vaultAddress, indexTokenAddress, collateralTokenAddress, isLong: true };
        const short = { address: this.vaultAddress, indexTokenAddress, collateralTokenAddress, isLong: false };
        return [long, short];
      }),
    );

    return compact(definitions);
  }

  async getTokenDefinitions({
    definition,
  }: GetTokenDefinitionsParams<MyceliumVault, MyceliumPerpContractPositionDefinition>) {
    return [
      { metaType: MetaType.SUPPLIED, address: definition.collateralTokenAddress, network: this.network },
      { metaType: MetaType.SUPPLIED, address: definition.indexTokenAddress, network: this.network },
      { metaType: MetaType.SUPPLIED, address: this.usdcAddress, network: this.network },
    ];
  }

  async getDataProps({
    definition,
  }: GetDataPropsParams<MyceliumVault, MyceliumPerpContractPositionDataProps, MyceliumPerpContractPositionDefinition>) {
    return { isLong: definition.isLong, positionKey: `${definition.isLong}` };
  }

  async getLabel({
    contractPosition,
  }: GetDisplayPropsParams<
    MyceliumVault,
    MyceliumPerpContractPositionDataProps,
    MyceliumPerpContractPositionDefinition
  >) {
    const [collateralToken, indexToken] = contractPosition.tokens;
    const marketLabel = [indexToken, collateralToken].map(v => getLabelFromToken(v)).join(' / ');
    return `${contractPosition.dataProps.isLong ? 'Long' : 'Short'} ${marketLabel}`;
  }

  async getImages({
    contractPosition,
  }: GetDisplayPropsParams<MyceliumVault, MyceliumPerpContractPositionDataProps, DefaultContractPositionDefinition>) {
    const [collateralToken, indexToken] = contractPosition.tokens;
    return [indexToken, collateralToken].flatMap(v => getImagesFromToken(v));
  }

  async getTokenBalancesPerPosition({
    address,
    contractPosition,
    contract,
  }: GetTokenBalancesParams<MyceliumVault, MyceliumPerpContractPositionDataProps>) {
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
