import { Inject } from '@nestjs/common';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { AppTokenPositionBalance } from '~position/position-balance.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { BendDaoContractFactory } from '../contracts';
import { BendDaoDebtToken } from '../contracts/ethers/BendDaoDebtToken';

@PositionTemplate()
export class EthereumBendDaoVariableDebtTokenFetcher extends AppTokenTemplatePositionFetcher<BendDaoDebtToken> {
  groupLabel = 'Lending';
  debtTokenAddress = '0x87dde3a3f4b629e389ce5894c9a1f34a7eec5648';
  wethAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
  dataProviderAddress = '0x0b54cdf07d5467012a2d5731c5f87f9c6945bea9';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BendDaoContractFactory) protected readonly contractFactory: BendDaoContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): BendDaoDebtToken {
    return this.contractFactory.bendDaoDebtToken({ network: this.network, address });
  }

  getAddresses(): string[] | Promise<string[]> {
    return [this.debtTokenAddress];
  }

  async getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensParams<BendDaoDebtToken>) {
    return contract.UNDERLYING_ASSET_ADDRESS();
  }

  async getLiquidity({ appToken }: GetDataPropsParams<BendDaoDebtToken>): Promise<number> {
    return -1 * appToken.price * appToken.supply;
  }

  async getReserves({ appToken }: GetDataPropsParams<BendDaoDebtToken>): Promise<number[]> {
    return [appToken.pricePerShare[0] * appToken.supply];
  }

  async getApy({ multicall }: GetDataPropsParams<BendDaoDebtToken>): Promise<number> {
    const pool = multicall.wrap(
      this.contractFactory.bendDaoProtocolDataProvider({
        network: this.network,
        address: this.dataProviderAddress,
      }),
    );

    const reservesData = await pool.getReserveData(this.wethAddress);
    return (Number(reservesData.variableBorrowRate) / 10 ** 27) * 100;
  }

  async getLabel({ appToken }: GetDisplayPropsParams<BendDaoDebtToken>): Promise<string> {
    return getLabelFromToken(appToken.tokens[0]);
  }

  async getLabelDetailed({ appToken }: GetDisplayPropsParams<BendDaoDebtToken>): Promise<string> {
    return appToken.symbol;
  }

  async getTertiaryLabel({ appToken }: GetDisplayPropsParams<BendDaoDebtToken>) {
    return `${appToken.dataProps.apy.toFixed(3)}% APR (variable)`;
  }

  async getBalances(address: string): Promise<AppTokenPositionBalance<DefaultAppTokenDataProps>[]> {
    const multicall = this.appToolkit.getMulticall(this.network);
    const appTokens = await this.appToolkit.getAppTokenPositions<DefaultAppTokenDataProps>({
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

    return balances as AppTokenPositionBalance<DefaultAppTokenDataProps>[];
  }
}
