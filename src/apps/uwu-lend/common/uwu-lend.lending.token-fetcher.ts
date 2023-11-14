import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { UwuLendViemContractFactory } from '../contracts';
import { UwuLendUToken } from '../contracts/viem';

export type UwuLendTokenDataProps = {
  apy: number;
  liquidity: number;
  isActive: boolean;
};

export type UwuLendReserveTokenAddressesData = {
  aTokenAddress: string;
  stableDebtTokenAddress: string;
  variableDebtTokenAddress: string;
};

export type UwuLendReserveApyData = {
  supplyApy: number;
  stableBorrowApy: number;
  variableBorrowApy: number;
};

export type UwuLendReserveConfigurationData = {
  enabledAsCollateral: boolean;
  liquidationThreshold: number;
};

export abstract class UwuLendLendingTokenFetcher extends AppTokenTemplatePositionFetcher<UwuLendUToken> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(UwuLendViemContractFactory) protected readonly contractFactory: UwuLendViemContractFactory,
  ) {
    super(appToolkit);
  }

  abstract providerAddress: string;
  abstract getTokenAddress(reserveTokenAddressesData: UwuLendReserveTokenAddressesData): string;
  abstract getApyFromReserveData(reserveApyData: UwuLendReserveApyData): number;

  getContract(address: string) {
    return this.contractFactory.uwuLendUToken({ network: this.network, address });
  }

  async getAddresses(): Promise<string[]> {
    const multicall = this.appToolkit.getViemMulticall(this.network);

    const pool = multicall.wrap(
      this.contractFactory.uwuLendDataProvider({
        network: this.network,
        address: this.providerAddress,
      }),
    );

    const reserveTokenAddreses = await pool.read.getReservesList();
    const reserveTokensData = await Promise.all(reserveTokenAddreses.map(r => pool.read.getReserveData([r])));

    return reserveTokensData.map(v =>
      this.getTokenAddress({
        aTokenAddress: v.aTokenAddress.toLowerCase(),
        stableDebtTokenAddress: v.stableDebtTokenAddress.toLowerCase(),
        variableDebtTokenAddress: v.variableDebtTokenAddress.toLowerCase(),
      }),
    );
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<UwuLendUToken>) {
    return [{ address: await contract.read.UNDERLYING_ASSET_ADDRESS(), network: this.network }];
  }

  async getPricePerShare() {
    return [1];
  }

  async getApy({ appToken, multicall }: GetDataPropsParams<UwuLendUToken>): Promise<number> {
    const pool = this.contractFactory.uwuLendDataProvider({
      network: this.network,
      address: this.providerAddress,
    });

    const reservesData = await multicall.wrap(pool).read.getReserveData([appToken.tokens[0].address]);
    const supplyApy = (Number(reservesData.currentLiquidityRate) / 10 ** 27) * 100;
    const stableBorrowApy = (Number(reservesData.currentStableBorrowRate) / 10 ** 27) * 100;
    const variableBorrowApy = (Number(reservesData.currentVariableBorrowRate) / 10 ** 27) * 100;

    return this.getApyFromReserveData({ supplyApy, stableBorrowApy, variableBorrowApy });
  }

  async getDataProps(params: GetDataPropsParams<UwuLendUToken>) {
    const defaultDataProps = await super.getDataProps(params);
    const isActive = Math.abs(defaultDataProps.liquidity) > 0;
    return { ...defaultDataProps, isActive };
  }

  async getLabel({ appToken }: GetDisplayPropsParams<UwuLendUToken>): Promise<string> {
    return getLabelFromToken(appToken.tokens[0]);
  }

  async getLabelDetailed({ appToken }: GetDisplayPropsParams<UwuLendUToken>): Promise<string> {
    return appToken.symbol;
  }
}
