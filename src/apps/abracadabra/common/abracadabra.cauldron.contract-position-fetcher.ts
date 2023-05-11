import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import {
  buildDollarDisplayItem,
  buildNumberDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DefaultDataProps, StatsItem } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { isBorrowed, isSupplied } from '~position/position.utils';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  DefaultContractPositionDefinition,
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { AbracadabraContractFactory, AbracadabraCauldron, AbracadabraMarketLens } from '../contracts';
import { MarketLens } from '../contracts/ethers/AbracadabraMarketLens';

import { CAULDRON_V1_RISK_CONSTANTS, MARKET_LENS_ADDRESS } from './abracadabra.common.constants';

interface AbracadabraCommonCauldronContractPositionDefinition extends DefaultContractPositionDefinition {
  type: 'REGULAR' | 'CONVEX' | 'GLP';
}

interface AbracadabraCauldronV1ContractPositionDefinition extends AbracadabraCommonCauldronContractPositionDefinition {
  version: 'V1';
  risk: 'MEDIUM' | 'LOW';
}

interface AbracadabraCauldronV2ContractPositionDefinition extends AbracadabraCommonCauldronContractPositionDefinition {
  version: 'V2';
}

interface AbracadabraCauldronV3ContractPositionDefinition extends AbracadabraCommonCauldronContractPositionDefinition {
  version: 'V3';
}

interface AbracadabraCauldronV4ContractPositionDefinition extends AbracadabraCommonCauldronContractPositionDefinition {
  version: 'V4';
}

interface AbracadabraCauldronProtocolOwnedDebtContractPositionDefinition
  extends AbracadabraCommonCauldronContractPositionDefinition {
  version: 'POD';
}

export type AbracadabraCauldronContractPositionDefinition =
  | AbracadabraCauldronV1ContractPositionDefinition
  | AbracadabraCauldronV2ContractPositionDefinition
  | AbracadabraCauldronV3ContractPositionDefinition
  | AbracadabraCauldronV4ContractPositionDefinition
  | AbracadabraCauldronProtocolOwnedDebtContractPositionDefinition;

type AbracadabraCauldronV3PlusContractPositionDefinition =
  | AbracadabraCauldronV3ContractPositionDefinition
  | AbracadabraCauldronV4ContractPositionDefinition;

export interface AbracadabraCauldronDataProps extends DefaultDataProps {
  definition: AbracadabraCauldronContractPositionDefinition;
  supply: number;
  supplyUSD: number;
  borrow: number;
  borrowUSD: number;
  availableBorrow: number;
  borrowApy: number;
  borrowFee?: number;
  maxLTV?: number;
  liquidationFee?: number;
}

export abstract class AbracadabraCauldronContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  AbracadabraCauldron,
  AbracadabraCauldronDataProps,
  AbracadabraCauldronContractPositionDefinition
> {
  marketLensAddress: string = MARKET_LENS_ADDRESS;
  cauldrons: AbracadabraCauldronContractPositionDefinition[];

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AbracadabraContractFactory) protected readonly contractFactory: AbracadabraContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): AbracadabraCauldron {
    return this.contractFactory.abracadabraCauldron({ address, network: this.network });
  }

  async getDefinitions() {
    return this.cauldrons;
  }

  async getTokenDefinitions(
    params: GetTokenDefinitionsParams<AbracadabraCauldron, AbracadabraCauldronContractPositionDefinition>,
  ) {
    const {
      definition: { type },
    } = params;
    switch (type) {
      case 'REGULAR':
        return this.getRegularTokenDefinitions(params);
      case 'CONVEX':
        return this.getConvexTokenDefinitions(params);
      case 'GLP':
        return this.getGlpTokenDefinitions(params);
    }
  }

  private async getRegularTokenDefinitions({
    contract,
  }: GetTokenDefinitionsParams<AbracadabraCauldron, AbracadabraCauldronContractPositionDefinition>) {
    const [collateralAddressRaw, debtAddressRaw] = await Promise.all([
      contract.collateral(),
      contract.magicInternetMoney(),
    ]);

    return [
      {
        metaType: MetaType.SUPPLIED,
        address: collateralAddressRaw,
        network: this.network,
      },
      {
        metaType: MetaType.BORROWED,
        address: debtAddressRaw,
        network: this.network,
      },
    ];
  }

  private async getConvexTokenDefinitions({
    contract,
    multicall,
  }: GetTokenDefinitionsParams<AbracadabraCauldron, AbracadabraCauldronContractPositionDefinition>) {
    const convexWrapperPromise = contract.collateral().then(collateralTokenAddress =>
      multicall.wrap(
        this.contractFactory.abracadabraConvexWrapper({
          address: collateralTokenAddress.toLowerCase(),
          network: this.network,
        }),
      ),
    );

    const [collateralTokenAddress, debtTokenAddress, convexToken, rewardTokens] = await Promise.all([
      convexWrapperPromise.then(convexWrapper => convexWrapper.convexToken()),
      contract.magicInternetMoney(),
      convexWrapperPromise.then(convexWrapper => convexWrapper.cvx()),
      convexWrapperPromise.then(async convexWrapper => {
        const poolCount = await convexWrapper.rewardLength();

        return Promise.all(
          [...Array(poolCount).keys()].map(async poolId => {
            const { reward_token: rewardToken } = await convexWrapper.rewards(poolId);
            return rewardToken;
          }),
        );
      }),
    ]);

    return [
      {
        metaType: MetaType.SUPPLIED,
        address: collateralTokenAddress,
        network: this.network,
      },
      {
        metaType: MetaType.BORROWED,
        address: debtTokenAddress,
        network: this.network,
      },
      // Convex token is always claimable
      ...[convexToken, ...rewardTokens].map(rewardToken => ({
        metaType: MetaType.CLAIMABLE,
        address: rewardToken,
        network: this.network,
      })),
    ];
  }

  private async getGlpTokenDefinitions({
    contract,
    multicall,
  }: GetTokenDefinitionsParams<AbracadabraCauldron, AbracadabraCauldronContractPositionDefinition>) {
    const [collateralTokenAddress, debtTokenAddress] = await Promise.all([
      contract.collateral(),
      contract.magicInternetMoney(),
    ]);

    const glpWrapper = multicall.wrap(
      this.contractFactory.abracadabraGlpWrapper({
        address: collateralTokenAddress,
        network: this.network,
      }),
    );

    const sGlpAddress = await glpWrapper.underlying();

    const sGlp = multicall.wrap(
      this.contractFactory.abracadabraGmxSGlp({
        address: sGlpAddress,
        network: this.network,
      }),
    );

    const glpAddress = await sGlp.glp();

    return [
      {
        metaType: MetaType.SUPPLIED,
        address: glpAddress,
        network: this.network,
      },
      {
        metaType: MetaType.BORROWED,
        address: debtTokenAddress,
        network: this.network,
      },
    ];
  }

  private async getMarketInfoCauldronV1({
    contract: cauldron,
    multicall,
    definition: { address: cauldronAddress, risk: cauldronRisk },
  }: GetDataPropsParams<
    AbracadabraCauldron,
    AbracadabraCauldronDataProps,
    AbracadabraCauldronV1ContractPositionDefinition
  >) {
    const marketLens = multicall.wrap(
      this.contractFactory.abracadabraMarketLens({
        address: this.marketLensAddress,
        network: this.network,
      }),
    );

    const [supplyRaw, borrowRaw, availableBorrowRaw] = await Promise.all([
      marketLens.getTotalCollateral(cauldronAddress).then(totalCollateral => totalCollateral.amount),
      cauldron.totalBorrow().then(totalBorrow => totalBorrow.elastic),
      marketLens.getMaxMarketBorrowForCauldronV2(cauldronAddress),
    ]);

    const {
      interestPerYear: borrowApyBips,
      borrowFee: borrowFeeBips,
      maximumCollateralRatio: maxLTVBips,
      liquidationFee: liquidationFeeBips,
    } = CAULDRON_V1_RISK_CONSTANTS[cauldronRisk];

    return {
      supplyRaw,
      borrowRaw,
      availableBorrowRaw,
      borrowApyBips,
      borrowFeeBips,
      maxLTVBips,
      liquidationFeeBips,
    };
  }

  private async getMarketInfoMarketLens(
    marketLensCall: (
      marketLens: AbracadabraMarketLens,
      cauldronAddress: string,
    ) => Promise<MarketLens.MarketInfoStructOutput>,
    {
      multicall,
      definition: { address: cauldronAddress },
    }: GetDataPropsParams<
      AbracadabraCauldron,
      AbracadabraCauldronDataProps,
      AbracadabraCauldronContractPositionDefinition
    >,
  ) {
    const marketLens = multicall.wrap(
      this.contractFactory.abracadabraMarketLens({
        address: this.marketLensAddress,
        network: this.network,
      }),
    );
    const marketInfo = await marketLensCall(marketLens, cauldronAddress);

    return {
      supplyRaw: marketInfo.totalCollateral.amount,
      borrowRaw: marketInfo.totalBorrowed,
      availableBorrowRaw: marketInfo.marketMaxBorrow,
      borrowApyBips: marketInfo.interestPerYear,
      borrowFeeBips: marketInfo.borrowFee,
      maxLTVBips: marketInfo.maximumCollateralRatio,
      liquidationFeeBips: marketInfo.liquidationFee,
    };
  }

  private async getMarketInfoCauldronV2(
    params: GetDataPropsParams<
      AbracadabraCauldron,
      AbracadabraCauldronDataProps,
      AbracadabraCauldronV2ContractPositionDefinition
    >,
  ) {
    return this.getMarketInfoMarketLens(
      (marketLens, cauldronAddress) => marketLens.getMarketInfoCauldronV2(cauldronAddress),
      params,
    );
  }

  private async getMarketInfoCauldronV3Plus(
    params: GetDataPropsParams<
      AbracadabraCauldron,
      AbracadabraCauldronDataProps,
      AbracadabraCauldronV3PlusContractPositionDefinition
    >,
  ) {
    return this.getMarketInfoMarketLens(
      (marketLens, cauldronAddress) => marketLens.getMarketInfoCauldronV2(cauldronAddress),
      params,
    );
  }

  private async getMarketInfoProtocolOwnedDebt({
    contract: cauldron,
  }: GetDataPropsParams<
    AbracadabraCauldron,
    AbracadabraCauldronDataProps,
    AbracadabraCauldronProtocolOwnedDebtContractPositionDefinition
  >) {
    const borrowRaw = await cauldron.totalBorrow().then(totalBorrow => totalBorrow.elastic);

    return {
      supplyRaw: 0,
      borrowRaw,
      availableBorrowRaw: 0,
      borrowApyBips: 0,
      borrowFeeBips: undefined,
      maxLTVBips: undefined,
      liquidationFeeBips: undefined,
    };
  }

  private async getMarketInfo(
    params: GetDataPropsParams<
      AbracadabraCauldron,
      AbracadabraCauldronDataProps,
      AbracadabraCauldronContractPositionDefinition
    >,
  ) {
    const { definition } = params;
    switch (definition.version) {
      case 'V1':
        return this.getMarketInfoCauldronV1({ ...params, definition });
      case 'V2':
        return this.getMarketInfoCauldronV2({ ...params, definition });
      case 'V3':
        return this.getMarketInfoCauldronV3Plus({ ...params, definition });
      case 'V4':
        return this.getMarketInfoCauldronV3Plus({ ...params, definition });
      case 'POD':
        return this.getMarketInfoProtocolOwnedDebt({ ...params, definition });
    }
  }

  async getDataProps(
    params: GetDataPropsParams<
      AbracadabraCauldron,
      AbracadabraCauldronDataProps,
      AbracadabraCauldronContractPositionDefinition
    >,
  ): Promise<AbracadabraCauldronDataProps> {
    const marketInfo = await this.getMarketInfo(params);

    const { contractPosition, definition } = params;
    const suppliedToken = contractPosition.tokens.find(isSupplied)!;
    const borrowedToken = contractPosition.tokens.find(isBorrowed)!;

    const supply = Number(marketInfo.supplyRaw) / 10 ** suppliedToken.decimals;
    const borrow = Number(marketInfo.borrowRaw) / 10 ** borrowedToken.decimals;
    const dataProps: AbracadabraCauldronDataProps = {
      definition,
      supply,
      supplyUSD: supply * suppliedToken.price,
      borrow,
      borrowUSD: borrow * borrowedToken.price,
      availableBorrow: Number(marketInfo.availableBorrowRaw) / 10 ** borrowedToken.decimals,
      borrowApy: Number(marketInfo.borrowApyBips) / 100,
    };
    if (marketInfo.borrowFeeBips) {
      dataProps.borrowFee = Number(marketInfo.borrowFeeBips) / 100;
    }
    if (marketInfo.maxLTVBips) {
      dataProps.maxLTV = Number(marketInfo.maxLTVBips) / 100;
    }
    if (marketInfo.liquidationFeeBips) {
      dataProps.liquidationFee = Number(marketInfo.liquidationFeeBips) / 100;
    }

    return dataProps;
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<AbracadabraCauldron>) {
    const suppliedToken = contractPosition.tokens.find(isSupplied)!;
    return `${getLabelFromToken(suppliedToken)} Cauldron`;
  }

  async getStatsItems({
    contractPosition: {
      dataProps: {
        supply,
        supplyUSD,
        borrow,
        borrowUSD,
        availableBorrow,
        borrowApy,
        borrowFee,
        maxLTV,
        liquidationFee,
      },
    },
  }: GetDisplayPropsParams<
    AbracadabraCauldron,
    AbracadabraCauldronDataProps,
    DefaultContractPositionDefinition
  >): Promise<StatsItem[] | undefined> {
    const statsItems = [
      { label: 'Total Supply', value: buildNumberDisplayItem(supply) },
      { label: 'Total Supply USD', value: buildDollarDisplayItem(supplyUSD) },
      { label: 'Total Borrow', value: buildNumberDisplayItem(borrow) },
      { label: 'Total Borrow USD', value: buildDollarDisplayItem(borrowUSD) },
      { label: 'Available Borrow', value: buildNumberDisplayItem(availableBorrow) },
      { label: 'Borrow APY', value: buildPercentageDisplayItem(borrowApy) },
    ];

    if (borrowFee) {
      statsItems.push({ label: 'Borrow Fee', value: buildPercentageDisplayItem(borrowFee) });
    }
    if (maxLTV) {
      statsItems.push({ label: 'Maximum Collateralization Ratio', value: buildPercentageDisplayItem(maxLTV) });
    }
    if (liquidationFee) {
      statsItems.push({ label: 'Liquidation Fee', value: buildPercentageDisplayItem(liquidationFee) });
    }

    return statsItems;
  }

  private async getClaimableTokensConvex({
    address,
    contract,
    multicall,
  }: GetTokenBalancesParams<AbracadabraCauldron, AbracadabraCauldronDataProps>) {
    const collateral = await contract.collateral().then(collateralTokenAddress =>
      multicall.wrap(
        this.contractFactory.abracadabraConvexWrapper({
          address: collateralTokenAddress.toLowerCase(),
          network: this.network,
        }),
      ),
    );

    const earned = await collateral.earned(address);
    return Object.fromEntries(earned.map(({ token, amount }) => [token.toLowerCase(), amount]));
  }

  private async getClaimableTokens(
    params: GetTokenBalancesParams<AbracadabraCauldron, AbracadabraCauldronDataProps>,
  ): Promise<{ [address: string]: BigNumber }> {
    switch (params.contractPosition.dataProps.definition.type) {
      case 'CONVEX':
        return this.getClaimableTokensConvex(params);
      default:
        return {};
    }
  }

  async getTokenBalancesPerPosition(params: GetTokenBalancesParams<AbracadabraCauldron, AbracadabraCauldronDataProps>) {
    const { address, contractPosition, contract, multicall } = params;
    const [borrowPartRaw, totalBorrowRaw, suppliedBalanceRaw, claimableTokens] = await Promise.all([
      contract.userBorrowPart(address),
      contract.totalBorrow(),
      Promise.all([contract.userCollateralShare(address), contract.bentoBox()]).then(
        ([collateralShareRaw, bentoBoxAddress]) => {
          const bentoBoxContract = multicall.wrap(
            this.contractFactory.abracadabraBentoBoxTokenContract({
              address: bentoBoxAddress,
              network: this.network,
            }),
          );

          const suppliedToken = contractPosition.tokens.find(isSupplied)!;

          return bentoBoxContract.toAmount(suppliedToken.address, collateralShareRaw, false);
        },
      ),
      this.getClaimableTokens(params),
    ]);

    const borrowedBalanceRaw = totalBorrowRaw.base.eq(0)
      ? 0
      : borrowPartRaw.mul(totalBorrowRaw.elastic).div(totalBorrowRaw.base);

    return [
      suppliedBalanceRaw,
      borrowedBalanceRaw,
      ...contractPosition.tokens.slice(2).map(token => claimableTokens[token.address.toLowerCase()] ?? 0),
    ];
  }
}
