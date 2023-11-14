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

import { AaveV2ViemContractFactory } from '../contracts';
import { AaveV2AToken } from '../contracts/viem/AaveV2AToken';

export type AaveV2TokenDataProps = {
  apy: number;
  enabledAsCollateral: boolean;
  liquidity: number;
  liquidationThreshold: number;
  isActive: boolean;
};

export type AaveV2ReserveTokenAddressesData = {
  aTokenAddress: string;
  stableDebtTokenAddress: string;
  variableDebtTokenAddress: string;
};

export type AaveV2ReserveApyData = {
  supplyApy: number;
  stableBorrowApy: number;
  variableBorrowApy: number;
};

export type AaveV2ReserveConfigurationData = {
  enabledAsCollateral: boolean;
  liquidationThreshold: number;
};

export type AaveV2LendingTokenDataProps = DefaultAppTokenDataProps & {
  enabledAsCollateral: boolean;
  liquidationThreshold: number;
};

export abstract class AaveV2LendingTokenFetcher extends AppTokenTemplatePositionFetcher<
  AaveV2AToken,
  AaveV2LendingTokenDataProps
> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AaveV2ViemContractFactory) protected readonly contractFactory: AaveV2ViemContractFactory,
  ) {
    super(appToolkit);
  }

  abstract providerAddress: string;
  abstract getTokenAddress(reserveTokenAddressesData: AaveV2ReserveTokenAddressesData): string;
  abstract getApyFromReserveData(reserveApyData: AaveV2ReserveApyData): number;

  getContract(address: string) {
    return this.contractFactory.aaveV2AToken({ network: this.network, address });
  }

  async getAddresses(): Promise<string[]> {
    const multicall = this.appToolkit.getViemMulticall(this.network);
    const pool = multicall.wrap(
      this.contractFactory.aaveProtocolDataProvider({
        network: this.network,
        address: this.providerAddress,
      }),
    );

    const reserveTokens = await pool.read.getAllReservesTokens();
    const reserveTokenAddreses = reserveTokens.map(v => v.tokenAddress);
    const reserveTokensData = await Promise.all(
      reserveTokenAddreses.map(r => pool.read.getReserveTokensAddresses([r])),
    );

    return reserveTokensData.map(v =>
      this.getTokenAddress({
        aTokenAddress: v[0].toLowerCase(),
        stableDebtTokenAddress: v[1].toLowerCase(),
        variableDebtTokenAddress: v[2].toLowerCase(),
      }),
    );
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<AaveV2AToken>) {
    return [{ address: await contract.read.UNDERLYING_ASSET_ADDRESS(), network: this.network }];
  }

  async getPricePerShare() {
    return [1];
  }

  async getReserveConfigDataProps({
    appToken,
    multicall,
  }: GetDataPropsParams<AaveV2AToken, AaveV2TokenDataProps>): Promise<AaveV2ReserveConfigurationData> {
    const pool = multicall.wrap(
      this.contractFactory.aaveProtocolDataProvider({
        network: this.network,
        address: this.providerAddress,
      }),
    );

    const reserveConfigurationData = await pool.read.getReserveConfigurationData([appToken.tokens[0].address]);
    const liquidationThreshold = Number(reserveConfigurationData[2]) / 10 ** 4;
    const enabledAsCollateral = reserveConfigurationData[5];

    return { liquidationThreshold, enabledAsCollateral };
  }

  async getApy({
    appToken,
    multicall,
  }: GetDataPropsParams<AaveV2AToken, AaveV2LendingTokenDataProps>): Promise<number> {
    const pool = this.contractFactory.aaveProtocolDataProvider({
      network: this.network,
      address: this.providerAddress,
    });

    const reservesData = await multicall.wrap(pool).read.getReserveData([appToken.tokens[0].address]);
    const supplyApy = (Number(reservesData[3]) / 10 ** 27) * 100;
    const stableBorrowApy = (Number(reservesData[5]) / 10 ** 27) * 100;
    const variableBorrowApy = (Number(reservesData[4]) / 10 ** 27) * 100;

    return this.getApyFromReserveData({ supplyApy, stableBorrowApy, variableBorrowApy });
  }

  async getDataProps(params: GetDataPropsParams<AaveV2AToken, AaveV2LendingTokenDataProps>) {
    const defaultDataProps = await super.getDataProps(params);
    const reserveConfigDataProps = await this.getReserveConfigDataProps(params);
    const isActive = Math.abs(defaultDataProps.liquidity) > 0;
    return { ...defaultDataProps, ...reserveConfigDataProps, isActive };
  }

  async getLabel({ appToken }: GetDisplayPropsParams<AaveV2AToken, AaveV2LendingTokenDataProps>): Promise<string> {
    return getLabelFromToken(appToken.tokens[0]);
  }

  async getLabelDetailed({
    appToken,
  }: GetDisplayPropsParams<AaveV2AToken, AaveV2LendingTokenDataProps>): Promise<string> {
    return appToken.symbol;
  }
}
