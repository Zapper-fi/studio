import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { Erc721 } from '~contract/contracts/viem';
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

import { SpiceFinanceViemContractFactory } from '../contracts';

@PositionTemplate()
export class EthereumSpiceFinanceWethTokenFetcher extends AppTokenTemplatePositionFetcher<Erc721> {
  groupLabel = 'WETH';

  vaultAddress = '0x6110d61dd1133b0f845f1025d6678cd22a11a2fe';
  underlyingTokenAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';

  constructor(
    @Inject(APP_TOOLKIT) public readonly appToolkit: IAppToolkit,
    @Inject(SpiceFinanceViemContractFactory)
    private readonly spiceFinanceContractFactory: SpiceFinanceViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.appToolkit.globalViemContracts.erc721({ address, network: this.network });
  }

  async getAddresses(_params: GetAddressesParams<DefaultAppTokenDefinition>): Promise<string[]> {
    return [this.vaultAddress];
  }

  async getUnderlyingTokenDefinitions(
    _params: GetUnderlyingTokensParams<Erc721, DefaultAppTokenDefinition>,
  ): Promise<UnderlyingTokenDefinition[]> {
    return [{ address: this.underlyingTokenAddress, network: this.network }];
  }

  async getPricePerShare(
    _params: GetPricePerShareParams<Erc721, DefaultAppTokenDataProps, DefaultAppTokenDefinition>,
  ): Promise<number[]> {
    return [1];
  }

  async getLiquidity({ appToken }: GetDataPropsParams<Erc721>) {
    const vault = this.spiceFinanceContractFactory.spiceFinanceNftVault({
      address: this.vaultAddress,
      network: this.network,
    });
    const reserveRaw = await vault.read.totalAssets();
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    const liquidity = reserve * appToken.tokens[0].price;
    return liquidity;
  }

  async getReserves({ appToken }: GetDataPropsParams<Erc721>) {
    const vault = this.spiceFinanceContractFactory.spiceFinanceNftVault({
      address: this.vaultAddress,
      network: this.network,
    });
    const reserveRaw = await vault.read.totalAssets();
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    return [reserve];
  }

  async getApy(_params: GetDataPropsParams<Erc721>) {
    return 0;
  }

  async getDecimals(_params: GetDataPropsParams<Erc721>): Promise<number> {
    return 0;
  }
}
