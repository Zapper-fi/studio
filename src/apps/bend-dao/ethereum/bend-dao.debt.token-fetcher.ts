import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { AppTokenPositionBalance } from '~position/position-balance.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDefinition,
  GetAddressesParams,
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { Network } from '~types/network.interface';

import { BEND_DAO_DEFINITION } from '../bend-dao.definition';
import { BendDaoDebtToken } from '../contracts/ethers/BendDaoDebtToken';

import { BendDaoContractFactory } from '../contracts';

export type LendingTokenDataProps = {
  apy: number;
  liquidity: number;
};

@Injectable()
export class EthereumBendDAODebtTokenFetcher extends AppTokenTemplatePositionFetcher<
  BendDaoDebtToken,
  LendingTokenDataProps
> {
  appId = BEND_DAO_DEFINITION.id;
  groupId = BEND_DAO_DEFINITION.groups.borrow.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'Lending';
  debtTokenAddress = '0x87ddE3A3f4b629E389ce5894c9A1F34A7eeC5648';
  wethAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
  dataProviderAddress = '0x0B54cDf07D5467012A2D5731c5F87f9c6945bEa9';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BendDaoContractFactory) protected readonly contractFactory: BendDaoContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): BendDaoDebtToken {
    return this.contractFactory.bendDaoDebtToken({ network: this.network, address });
  }

  getAddresses(params: GetAddressesParams<DefaultAppTokenDefinition>): string[] | Promise<string[]> {
    return [this.debtTokenAddress];
  }
  async getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensParams<BendDaoDebtToken>) {
    return contract.UNDERLYING_ASSET_ADDRESS();
  }

  async getReserveApy({
    appToken,
    multicall,
  }: GetDataPropsParams<BendDaoDebtToken, LendingTokenDataProps>): Promise<number> {
    const pool = multicall.wrap(
      this.contractFactory.bendDaoProtocolDataProvider({
        network: this.network,
        address: this.dataProviderAddress,
      }),
    );

    const reservesData = await pool.getReserveData(this.wethAddress);

    return (Number(reservesData.variableBorrowRate) / 10 ** 27) * 100;
  }

  async getDataProps(opts: GetDataPropsParams<BendDaoDebtToken, LendingTokenDataProps>) {
    const apy = await this.getReserveApy(opts);

    const { appToken } = opts;
    const liquidity = -1 * appToken.price * appToken.supply;
    const isActive = Math.abs(liquidity) > 0;

    return { liquidity, isActive, apy };
  }

  async getLabel({ appToken }: GetDisplayPropsParams<BendDaoDebtToken, LendingTokenDataProps>): Promise<string> {
    return getLabelFromToken(appToken.tokens[0]);
  }

  async getLabelDetailed({
    appToken,
  }: GetDisplayPropsParams<BendDaoDebtToken, LendingTokenDataProps>): Promise<string> {
    return appToken.symbol;
  }

  async getBalances(address: string): Promise<AppTokenPositionBalance<LendingTokenDataProps>[]> {
    const multicall = this.appToolkit.getMulticall(this.network);
    const appTokens = await this.appToolkit.getAppTokenPositions<LendingTokenDataProps>({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });

    const balances = await Promise.all(
      appTokens.map(async appToken => {
        const balanceRaw = await this.getBalancePerToken({ multicall, address, appToken });
        const tokenBalance = drillBalance(appToken, balanceRaw.toString(), { isDebt: true });
        return tokenBalance;
      }),
    );

    return balances as AppTokenPositionBalance<LendingTokenDataProps>[];
  }

  async getTertiaryLabel({ appToken }: GetDisplayPropsParams<BendDaoDebtToken, LendingTokenDataProps>) {
    return `${appToken.dataProps.apy.toFixed(3)}% APR (variable)`;
  }
}
