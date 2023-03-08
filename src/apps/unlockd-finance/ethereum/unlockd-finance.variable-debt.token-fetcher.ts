import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetAddressesParams,
  DefaultAppTokenDefinition,
  GetUnderlyingTokensParams,
  UnderlyingTokenDefinition,
  GetDataPropsParams,
  GetDisplayPropsParams,
} from '~position/template/app-token.template.types';

import { UnlockdFinanceContractFactory, UnlockdFinanceUToken } from '../contracts';

const SECONDS_PER_YEAR = 31536000;

@PositionTemplate()
export class EthereumUnlockdFinanceVariableDebtTokenFetcher extends AppTokenTemplatePositionFetcher<UnlockdFinanceUToken> {
  groupLabel = 'Lending';
  debtTokenAddress = '0xd11cf5512a775591b3258d976af51d3a70a6660e'; // Mainnet DebtToken Address
  wethAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'; // Mainnet WETH Address
  dataProviderAddress = '0x4abde724f8d7cb5ec7b22a9b86824591be9fdc86'; // Mainnet Data Provider Address
  isDebt = true;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(UnlockdFinanceContractFactory)
    private readonly unlockdFinanceContractFactory: UnlockdFinanceContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): UnlockdFinanceUToken {
    return this.unlockdFinanceContractFactory.unlockdFinanceUToken({ network: this.network, address });
  }

  async getAddresses(_params: GetAddressesParams<DefaultAppTokenDefinition>): Promise<string[]> {
    return [this.debtTokenAddress];
  }

  async getUnderlyingTokenDefinitions({
    contract,
  }: GetUnderlyingTokensParams<UnlockdFinanceUToken, DefaultAppTokenDefinition>): Promise<UnderlyingTokenDefinition[]> {
    return [{ address: await contract.UNDERLYING_ASSET_ADDRESS(), network: this.network }];
  }

  async getPricePerShare() {
    return [1];
  }

  async getApy({ multicall }: GetDataPropsParams<UnlockdFinanceUToken>): Promise<number> {
    const pool = multicall.wrap(
      this.unlockdFinanceContractFactory.unlockdFinanceProtocolDataProvider({
        network: this.network,
        address: this.dataProviderAddress,
      }),
    );

    const reservesData = await pool.getReserveData(this.wethAddress);

    const apr = Number(reservesData.variableBorrowRate) / 10 ** 27;

    const base = apr / SECONDS_PER_YEAR + 1;

    const apy = base ** SECONDS_PER_YEAR - 1;

    return apy * 100;
  }

  async getLabel({ appToken }: GetDisplayPropsParams<UnlockdFinanceUToken>): Promise<string> {
    return getLabelFromToken(appToken.tokens[0]);
  }

  async getLabelDetailed({ appToken }: GetDisplayPropsParams<UnlockdFinanceUToken>): Promise<string> {
    return appToken.symbol;
  }

  async getTertiaryLabel({ appToken }: GetDisplayPropsParams<UnlockdFinanceUToken>) {
    return `${appToken.dataProps.apy.toFixed(3)}% APY (variable)`;
  }
}
