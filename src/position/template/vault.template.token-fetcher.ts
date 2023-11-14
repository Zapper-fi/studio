import { Erc20 } from '~contract/contracts/viem';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetDataPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

export abstract class VaultTemplateTokenFetcher extends AppTokenTemplatePositionFetcher<Erc20> {
  abstract vaultAddress: string;
  abstract underlyingTokenAddress: string;
  reserveAddress?: string;

  getContract(address: string) {
    return this.appToolkit.globalViemContracts.erc20({ address, network: this.network });
  }

  async getAddresses(): Promise<string[]> {
    return [this.vaultAddress];
  }

  async getUnderlyingTokenDefinitions(_params: GetUnderlyingTokensParams<Erc20>) {
    return [{ address: this.underlyingTokenAddress, network: this.network }];
  }

  async getPricePerShare({ multicall, appToken }: GetPricePerShareParams<Erc20>) {
    const underlying = multicall.wrap(this.appToolkit.globalViemContracts.erc20(appToken.tokens[0]));
    const reserveRaw = await underlying.read.balanceOf([this.reserveAddress ?? this.vaultAddress]);
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    const pricePerShare = reserve / appToken.supply;
    return [pricePerShare];
  }

  async getLiquidity({ multicall, appToken }: GetDataPropsParams<Erc20>) {
    const underlying = multicall.wrap(this.appToolkit.globalViemContracts.erc20(appToken.tokens[0]));
    const reserveRaw = await underlying.read.balanceOf([this.reserveAddress ?? this.vaultAddress]);
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    const liquidity = reserve * appToken.tokens[0].price;
    return liquidity;
  }

  async getReserves({ multicall, appToken }: GetDataPropsParams<Erc20>) {
    const underlying = multicall.wrap(this.appToolkit.globalViemContracts.erc20(appToken.tokens[0]));
    const reserveRaw = await underlying.read.balanceOf([this.reserveAddress ?? this.vaultAddress]);
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    return [reserve];
  }

  async getApy(_params: GetDataPropsParams<Erc20>) {
    return 0;
  }
}
