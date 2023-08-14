import { Inject, Injectable } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import _, { compact, sumBy } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { drillBalance } from '~app-toolkit/helpers/drill-balance.helper';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { MetaType } from '~position/position.interface';
import {
  GetDefinitionsParams,
  GetTokenDefinitionsParams,
  GetDisplayPropsParams,
  GetDataPropsParams,
  DefaultContractPositionDefinition,
} from '~position/template/contract-position.template.types';
import { CustomContractPositionTemplatePositionFetcher } from '~position/template/custom-contract-position.template.position-fetcher';

import { GmxContractFactory, GmxVault } from '../contracts';

export type GmxOptionContractPositionDefinition = {
  address: string;
  collateralTokenAddress: string;
  indexTokenAddress: string;
  isLong: boolean;
};

export type GmxOptionContractPositionDataProps = {
  isLong: boolean;
  positionKey: string;
};

@Injectable()
export abstract class GmxPerpContractPositionFetcher extends CustomContractPositionTemplatePositionFetcher<
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

    const definitions = await Promise.all(
      whitelistedTokens.flatMap(async v => {
        const isShortable = await multicall.wrap(vaultContract).shortableTokens(v.toLowerCase());
        if (!isShortable) return null;
        return whitelistedTokens.flatMap(t => {
          const long = { address: this.vaultAddress, indexTokenAddress: v, collateralTokenAddress: t, isLong: true };
          const short = { address: this.vaultAddress, indexTokenAddress: v, collateralTokenAddress: t, isLong: false };
          return [long, short];
        });
      }),
    );

    return compact(definitions.flat());
  }

  async getTokenDefinitions({ definition }: GetTokenDefinitionsParams<GmxVault, GmxOptionContractPositionDefinition>) {
    return [
      { metaType: MetaType.LOCKED, address: definition.collateralTokenAddress, network: this.network },
      { metaType: MetaType.SUPPLIED, address: definition.indexTokenAddress, network: this.network },
      { metaType: MetaType.SUPPLIED, address: this.usdcAddress, network: this.network },
    ];
  }

  async getDataProps({
    definition,
  }: GetDataPropsParams<GmxVault, GmxOptionContractPositionDataProps, GmxOptionContractPositionDefinition>) {
    return { isLong: definition.isLong, positionKey: `${definition.isLong}` };
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

  async getTokenBalancesPerPosition(): Promise<BigNumberish[]> {
    throw new Error('Method not implemented.');
  }

  async getBalances(address: string): Promise<ContractPositionBalance<GmxOptionContractPositionDataProps>[]> {
    const multicall = this.appToolkit.getMulticall(this.network);
    const contractPositions = await this.appToolkit.getAppContractPositions<GmxOptionContractPositionDataProps>({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });

    if (address === ZERO_ADDRESS) return [];

    const balances = await Promise.all(
      contractPositions.map(async contractPosition => {
        const contract = multicall.wrap(this.getContract(contractPosition.address));

        const [collateralToken, indexToken, usdcToken] = contractPosition.tokens;
        const isLong = contractPosition.dataProps.isLong;
        const positionKey = contractPosition.dataProps.positionKey;

        const position = await contract.getPosition(address, collateralToken.address, indexToken.address, isLong);
        // non existing position returns size and collateral = 0
        if (Number(position[0]) == 0 && Number(position[1]) == 0) return null;

        const [leverageRaw, basisPointDivisor] = await Promise.all([
          contract.getPositionLeverage(address, collateralToken.address, indexToken.address, isLong),
          contract.BASIS_POINTS_DIVISOR(),
        ]);
        const leverage = (Number(leverageRaw) / Number(basisPointDivisor)).toFixed(2);
        const size = Number(position[0]) / 10 ** 30;

        const delta = await contract.getPositionDelta(address, collateralToken.address, indexToken.address, isLong);

        const initialCollateralRaw = position[1];
        const initialCollateral = Number(initialCollateralRaw) / 10 ** 30;
        const deltaBalanceRaw = delta[1];
        const deltaBalance = Number(deltaBalanceRaw) / 10 ** 30;

        const hasProfit = delta[0];
        const balanceUsdPosition =
          hasProfit == true ? initialCollateral + deltaBalance : initialCollateral - deltaBalance;

        const profitToken = isLong ? indexToken : usdcToken;
        const balanceInProfitToken = balanceUsdPosition / profitToken.price;
        const balanceInProfitTokenRaw = balanceInProfitToken * 10 ** profitToken.decimals;
        const balancesRaw = isLong ? [0, balanceInProfitTokenRaw, 0] : [0, 0, balanceInProfitTokenRaw];

        const dataProps = {
          ...contractPosition.dataProps,
          size,
          leverage: Number(leverage),
        };

        const displayProps = {
          ...contractPosition.displayProps,
          isLong,
          positionKey,
          size,
          leverage,
        };

        contractPosition.dataProps = dataProps;
        contractPosition.displayProps = displayProps;

        const allTokens = contractPosition.tokens.map((cp, idx) =>
          drillBalance(cp, balancesRaw[idx]?.toString() ?? '0', { isDebt: cp.metaType === MetaType.BORROWED }),
        );

        const tokens = allTokens.filter(v => Math.abs(v.balanceUSD) > 0.01);
        const balanceUSD = sumBy(tokens, t => t.balanceUSD);

        const balance: ContractPositionBalance<GmxOptionContractPositionDataProps> = {
          ...contractPosition,
          tokens,
          balanceUSD,
        };
        return balance;
      }),
    );

    return _.compact(balances);
  }
}
