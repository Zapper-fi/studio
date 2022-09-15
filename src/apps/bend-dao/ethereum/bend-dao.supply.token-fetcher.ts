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
import { BendDaoBToken } from '../contracts/ethers/BendDaoBToken';

import { BendDaoContractFactory } from '../contracts';

export type LendingTokenDataProps = {
  apy: number;
  liquidity: number;
};

@Injectable()
export class EthereumBendDAOBTokenFetcher extends AppTokenTemplatePositionFetcher<
  BendDaoBToken,
  LendingTokenDataProps
> {
  appId = BEND_DAO_DEFINITION.id;
  groupId = BEND_DAO_DEFINITION.groups.supply.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'Lending';
  bTokenAddress = '0xeD1840223484483C0cb050E6fC344d1eBF0778a9';
  wethAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
  dataProviderAddress = '0x0B54cDf07D5467012A2D5731c5F87f9c6945bEa9';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BendDaoContractFactory) protected readonly contractFactory: BendDaoContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): BendDaoBToken {
    return this.contractFactory.bendDaoBToken({ network: this.network, address });
  }

  getAddresses(params: GetAddressesParams<DefaultAppTokenDefinition>): string[] | Promise<string[]> {
    return [this.bTokenAddress];
  }
  async getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensParams<BendDaoBToken>) {
    return contract.UNDERLYING_ASSET_ADDRESS();
  }

  async getReserveApy({
    appToken,
    multicall,
  }: GetDataPropsParams<BendDaoBToken, LendingTokenDataProps>): Promise<number> {
    const pool = multicall.wrap(
      this.contractFactory.bendDaoProtocolDataProvider({
        network: this.network,
        address: this.dataProviderAddress,
      }),
    );

    const reservesData = await pool.getReserveData(this.wethAddress);

    return (Number(reservesData.liquidityRate) / 10 ** 27) * 100;
  }

  async getDataProps(opts: GetDataPropsParams<BendDaoBToken, LendingTokenDataProps>) {
    const apy = await this.getReserveApy(opts);

    const { appToken } = opts;
    const liquidity = appToken.price * appToken.supply;
    const isActive = Math.abs(liquidity) > 0;

    return { liquidity, isActive, apy };
  }

  async getLabel({ appToken }: GetDisplayPropsParams<BendDaoBToken, LendingTokenDataProps>): Promise<string> {
    return getLabelFromToken(appToken.tokens[0]);
  }

  async getLabelDetailed({ appToken }: GetDisplayPropsParams<BendDaoBToken, LendingTokenDataProps>): Promise<string> {
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
        const tokenBalance = drillBalance(appToken, balanceRaw.toString(), { isDebt: false });
        return tokenBalance;
      }),
    );

    return balances as AppTokenPositionBalance<LendingTokenDataProps>[];
  }

  async getTertiaryLabel({ appToken }: GetDisplayPropsParams<BendDaoBToken, LendingTokenDataProps>) {
    return `${appToken.dataProps.apy.toFixed(3)}% APR`;
  }
}
