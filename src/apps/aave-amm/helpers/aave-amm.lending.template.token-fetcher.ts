import { Inject } from '@nestjs/common';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import {
  AaveV2LendingTokenDataProps,
  AaveV2ReserveApyData,
  AaveV2ReserveTokenAddressesData,
} from '~apps/aave-v2/helpers/aave-v2.lending.template.token-fetcher';
import { AppTokenPositionBalance } from '~position/position-balance.interface';
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

  abstract isDebt: boolean;
  abstract providerAddress: string;
  abstract getTokenAddress(reserveTokenAddressesData: AaveV2ReserveTokenAddressesData): string;
  abstract getApy(reserveApyData: AaveV2ReserveApyData): number;

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

  async getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensParams<AaveAmmAToken>) {
    return contract.UNDERLYING_ASSET_ADDRESS();
  }

  async getReserveApy({
    appToken,
    multicall,
  }: GetDataPropsParams<AaveAmmAToken, AaveV2LendingTokenDataProps>): Promise<number> {
    const pool = multicall.wrap(
      this.contractFactory.aaveAmmLendingPool({
        network: this.network,
        address: this.providerAddress,
      }),
    );

    const reservesData = await pool.getReserveData(appToken.tokens[0].address);

    return this.getApy({
      supplyApy: Number(reservesData[3]) / 10 ** 27,
      stableBorrowApy: Number(reservesData[4]) / 10 ** 27,
      variableBorrowApy: Number(reservesData[5]) / 10 ** 27,
    });
  }

  async getReserveConfigurationData({
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

  async getDataProps(opts: GetDataPropsParams<AaveAmmAToken, AaveV2LendingTokenDataProps>) {
    const reserveConfigData = await this.getReserveConfigurationData(opts);
    const apy = await this.getReserveApy(opts);

    const { appToken } = opts;
    const liquidity = (this.isDebt ? -1 : 1) * appToken.price * appToken.supply;
    const isActive = Math.abs(liquidity) > 0;

    return { liquidity, isActive, apy, ...reserveConfigData };
  }

  async getLabel({ appToken }: GetDisplayPropsParams<AaveAmmAToken, AaveV2LendingTokenDataProps>): Promise<string> {
    return getLabelFromToken(appToken.tokens[0]);
  }

  async getLabelDetailed({
    appToken,
  }: GetDisplayPropsParams<AaveAmmAToken, AaveV2LendingTokenDataProps>): Promise<string> {
    return appToken.symbol;
  }

  async getBalances(address: string): Promise<AppTokenPositionBalance<AaveV2LendingTokenDataProps>[]> {
    const multicall = this.appToolkit.getMulticall(this.network);
    const appTokens = await this.appToolkit.getAppTokenPositions<AaveV2LendingTokenDataProps>({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });

    const balances = await Promise.all(
      appTokens.map(async appToken => {
        const balanceRaw = await this.getBalancePerToken({ multicall, address, appToken });
        const tokenBalance = drillBalance(appToken, balanceRaw.toString(), { isDebt: this.isDebt });
        return tokenBalance;
      }),
    );

    return balances as AppTokenPositionBalance<AaveV2LendingTokenDataProps>[];
  }
}
