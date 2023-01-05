import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import {
  AaveV2LendingTokenDataProps,
  AaveV2ReserveApyData,
  AaveV2ReserveTokenAddressesData,
} from '~apps/aave-v2/common/aave-v2.lending.token-fetcher';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { AaveAmmContractFactory } from '../contracts';
import { AaveAmmAToken } from '../contracts/ethers/AaveAmmAToken';

const LT_MASK = Number('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000ffff');
const LT_START_BIT_POSITION = 16;

export abstract class AaveAmmLendingTemplateTokenFetcher extends AppTokenTemplatePositionFetcher<
  AaveAmmAToken,
  AaveV2LendingTokenDataProps
> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AaveAmmContractFactory) protected readonly contractFactory: AaveAmmContractFactory,
  ) {
    super(appToolkit);
  }

  abstract providerAddress: string;
  abstract getTokenAddress(reserveTokenAddressesData: AaveV2ReserveTokenAddressesData): string;
  abstract getApyFromReserveData(reserveApyData: AaveV2ReserveApyData): number;

  getContract(address: string): AaveAmmAToken {
    return this.contractFactory.aaveAmmAToken({ network: this.network, address });
  }

  async getAddresses(): Promise<string[]> {
    const multicall = this.appToolkit.getMulticall(this.network);
    const pool = multicall.wrap(
      this.contractFactory.aaveAmmLendingPool({
        network: this.network,
        address: this.providerAddress,
      }),
    );

    const reserveTokenAddresses = await pool.getReservesList();
    const reserveTokensData = await Promise.all(reserveTokenAddresses.map(r => pool.getReserveData(r)));

    return reserveTokensData.map(data =>
      this.getTokenAddress({
        aTokenAddress: data[7].toLowerCase(),
        stableDebtTokenAddress: data[8].toLowerCase(),
        variableDebtTokenAddress: data[9].toLowerCase(),
      }),
    );
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<AaveAmmAToken>) {
    return [{ address: await contract.UNDERLYING_ASSET_ADDRESS(), network: this.network }];
  }

  async getReserveConfigDataProps({
    appToken,
    multicall,
  }: GetDataPropsParams<AaveAmmAToken, AaveV2LendingTokenDataProps>) {
    const pool = multicall.wrap(
      this.contractFactory.aaveAmmLendingPool({
        network: this.network,
        address: this.providerAddress,
      }),
    );

    const data = await pool.getReserveData(appToken.tokens[0].address);
    const configurationData = data[0].data;
    if (!configurationData) return { liquidationThreshold: 0, enabledAsCollateral: false };

    const liquidationThreshold = (Number(configurationData) & ~LT_MASK) >> LT_START_BIT_POSITION;
    const enabledAsCollateral = liquidationThreshold > 0;
    return { liquidationThreshold, enabledAsCollateral };
  }

  async getLiquidity({ appToken }: GetDataPropsParams<AaveAmmAToken>) {
    return (this.isDebt ? -1 : 1) * appToken.price * appToken.supply;
  }

  async getReserves({ appToken }: GetDataPropsParams<AaveAmmAToken>) {
    return [appToken.pricePerShare[0] * appToken.supply];
  }

  async getApy({
    appToken,
    multicall,
  }: GetDataPropsParams<AaveAmmAToken, AaveV2LendingTokenDataProps>): Promise<number> {
    const pool = this.contractFactory.aaveAmmLendingPool({
      network: this.network,
      address: this.providerAddress,
    });

    const reservesData = await multicall.wrap(pool).getReserveData(appToken.tokens[0].address);
    const supplyApy = Number(reservesData[3]) / 10 ** 27;
    const stableBorrowApy = Number(reservesData[4]) / 10 ** 27;
    const variableBorrowApy = Number(reservesData[5]) / 10 ** 27;

    return this.getApyFromReserveData({ supplyApy, stableBorrowApy, variableBorrowApy });
  }

  async getDataProps(params: GetDataPropsParams<AaveAmmAToken, AaveV2LendingTokenDataProps>) {
    const defaultDataProps = await super.getDataProps(params);
    const reserveConfigDataProps = await this.getReserveConfigDataProps(params);
    const isActive = Math.abs(defaultDataProps.liquidity) > 0;
    return { ...defaultDataProps, ...reserveConfigDataProps, isActive };
  }

  async getLabel({ appToken }: GetDisplayPropsParams<AaveAmmAToken, AaveV2LendingTokenDataProps>): Promise<string> {
    return getLabelFromToken(appToken.tokens[0]);
  }

  async getLabelDetailed({
    appToken,
  }: GetDisplayPropsParams<AaveAmmAToken, AaveV2LendingTokenDataProps>): Promise<string> {
    return appToken.symbol;
  }
}
