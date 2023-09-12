import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { MahalendContractFactory } from '../contracts';
import { MahalendAToken } from '../contracts/ethers/MahalendAToken';

export type MahalendTokenDataProps = {
  apy: number;
  enabledAsCollateral: boolean;
  liquidity: number;
  liquidationThreshold: number;
  isActive: boolean;
};

export type MahalendReserveTokenAddressesData = {
  aTokenAddress: string;
  stableDebtTokenAddress: string;
  variableDebtTokenAddress: string;
};

export type MahalendReserveApyData = {
  supplyApy: number;
  stableBorrowApy: number;
  variableBorrowApy: number;
};

export type MahalendReserveConfigurationData = {
  enabledAsCollateral: boolean;
  liquidationThreshold: number;
};

export type MahalendLendingTokenDataProps = DefaultAppTokenDataProps & {
  enabledAsCollateral: boolean;
  liquidationThreshold: number;
};

export abstract class MahalendLendingTokenFetcher extends AppTokenTemplatePositionFetcher<
  MahalendAToken,
  MahalendLendingTokenDataProps
> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(MahalendContractFactory) protected readonly contractFactory: MahalendContractFactory,
  ) {
    super(appToolkit);
  }

  abstract providerAddress: string;
  abstract getTokenAddress(reserveTokenAddressesData: MahalendReserveTokenAddressesData): string;
  abstract getApyFromReserveData(reserveApyData: MahalendReserveApyData): number;

  getContract(address: string): MahalendAToken {
    return this.contractFactory.aaveV2AToken({ network: this.network, address });
  }

  async getAddresses(): Promise<string[]> {
    const multicall = this.appToolkit.getMulticall(this.network);
    const pool = multicall.wrap(
      this.contractFactory.aaveProtocolDataProvider({
        network: this.network,
        address: this.providerAddress,
      }),
    );

    const reserveTokens = await pool.getAllReservesTokens();
    const reserveTokenAddreses = reserveTokens.map(v => v[1]);
    const reserveTokensData = await Promise.all(reserveTokenAddreses.map(r => pool.getReserveTokensAddresses(r)));

    return reserveTokensData.map(v =>
      this.getTokenAddress({
        aTokenAddress: v.aTokenAddress.toLowerCase(),
        stableDebtTokenAddress: v.stableDebtTokenAddress.toLowerCase(),
        variableDebtTokenAddress: v.variableDebtTokenAddress.toLowerCase(),
      }),
    );
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<MahalendAToken>) {
    return [{ address: await contract.UNDERLYING_ASSET_ADDRESS(), network: this.network }];
  }

  async getPricePerShare() {
    return [1];
  }

  async getReserveConfigDataProps({
    appToken,
    multicall,
  }: GetDataPropsParams<MahalendAToken, MahalendTokenDataProps>): Promise<MahalendReserveConfigurationData> {
    const pool = multicall.wrap(
      this.contractFactory.aaveProtocolDataProvider({
        network: this.network,
        address: this.providerAddress,
      }),
    );

    const reserveConfigurationData = await pool.getReserveConfigurationData(appToken.tokens[0].address);
    const liquidationThreshold = Number(reserveConfigurationData.liquidationThreshold) / 10 ** 4;
    const enabledAsCollateral = reserveConfigurationData.usageAsCollateralEnabled;

    return { liquidationThreshold, enabledAsCollateral };
  }

  async getApy({
    appToken,
    multicall,
  }: GetDataPropsParams<MahalendAToken, MahalendLendingTokenDataProps>): Promise<number> {
    const pool = this.contractFactory.aaveProtocolDataProvider({
      network: this.network,
      address: this.providerAddress,
    });

    const reservesData = await multicall.wrap(pool).getReserveData(appToken.tokens[0].address);
    const supplyApy = (Number(reservesData.liquidityRate) / 10 ** 27) * 100;
    const stableBorrowApy = (Number(reservesData.stableBorrowRate) / 10 ** 27) * 100;
    const variableBorrowApy = (Number(reservesData.variableBorrowRate) / 10 ** 27) * 100;

    return this.getApyFromReserveData({ supplyApy, stableBorrowApy, variableBorrowApy });
  }

  async getDataProps(params: GetDataPropsParams<MahalendAToken, MahalendLendingTokenDataProps>) {
    const defaultDataProps = await super.getDataProps(params);
    const reserveConfigDataProps = await this.getReserveConfigDataProps(params);
    const isActive = Math.abs(defaultDataProps.liquidity) > 0;
    return { ...defaultDataProps, ...reserveConfigDataProps, isActive };
  }

  async getLabel({ appToken }: GetDisplayPropsParams<MahalendAToken, MahalendLendingTokenDataProps>): Promise<string> {
    return getLabelFromToken(appToken.tokens[0]);
  }

  async getLabelDetailed({
    appToken,
  }: GetDisplayPropsParams<MahalendAToken, MahalendLendingTokenDataProps>): Promise<string> {
    return appToken.symbol;
  }
}
