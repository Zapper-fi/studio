import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { Erc20, Erc721, Erc4626 } from '~contract/contracts';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetAddressesParams,
  DefaultAppTokenDefinition,
  GetUnderlyingTokensParams,
  UnderlyingTokenDefinition,
  GetDataPropsParams,
  GetPricePerShareParams,
  DefaultAppTokenDataProps,
} from '~position/template/app-token.template.types';

import { SpiceFinanceContractFactory, SpiceFinanceNftVault } from '../contracts';

@PositionTemplate()
export class EthereumSpiceFinanceWethTokenFetcher extends AppTokenTemplatePositionFetcher<SpiceFinanceNftVault> {
  groupLabel = "WETH";

  vaultAddress = "0x6110d61DD1133b0f845f1025d6678Cd22A11a2fe";
  underlyingTokenAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

  constructor(
    @Inject(APP_TOOLKIT) public readonly appToolkit: IAppToolkit,
    @Inject(SpiceFinanceContractFactory) private readonly spiceFinanceContractFactory: SpiceFinanceContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): SpiceFinanceNftVault {
    return this.spiceFinanceContractFactory.spiceFinanceNftVault({ address, network: this.network });
  }

  async getAddresses(_params: GetAddressesParams<DefaultAppTokenDefinition>): Promise<string[]> {
    return [this.vaultAddress];
  }

  async getUnderlyingTokenDefinitions(
    _params: GetUnderlyingTokensParams<SpiceFinanceNftVault, DefaultAppTokenDefinition>,
  ): Promise<UnderlyingTokenDefinition[]> {
    return [{ address: this.underlyingTokenAddress, network: this.network }];
  }

  async getPricePerShare(
    _params: GetPricePerShareParams<SpiceFinanceNftVault, DefaultAppTokenDataProps, DefaultAppTokenDefinition>,
  ): Promise<number[]> {
    return [1];
  }

  async getLiquidity({ appToken }: GetDataPropsParams<SpiceFinanceNftVault>) {
    const vault = this.spiceFinanceContractFactory.spiceFinanceNftVault({
      address: this.vaultAddress,
      network: this.network,
    });
    const reserveRaw = await vault.totalAssets();
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    const liquidity = reserve * appToken.tokens[0].price;
    return liquidity;
  }

  async getReserves({ appToken }: GetDataPropsParams<SpiceFinanceNftVault>) {
    const vault = this.spiceFinanceContractFactory.spiceFinanceNftVault({
      address: this.vaultAddress,
      network: this.network,
    });
    const reserveRaw = await vault.totalAssets();
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    return [reserve];
  }

  async getApy(_params: GetDataPropsParams<SpiceFinanceNftVault>) {
    return 0;
  }

  async getDecimals(_params: GetDataPropsParams<SpiceFinanceNftVault>): Promise<number> {
    return 0;
  }
}
