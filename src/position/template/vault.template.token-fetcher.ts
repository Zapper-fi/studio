import { Erc20 } from '~contract/contracts';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetDataPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

export type VaultTokenDataProps = {
  liquidity: number;
  reserve: number;
};

export abstract class VaultTokenFetcher extends AppTokenTemplatePositionFetcher<Erc20, VaultTokenDataProps> {
  abstract vaultAddress: string;
  abstract underlyingTokenAddress: string;
  reserveAddress?: string;

  getContract(address: string): Erc20 {
    return this.appToolkit.globalContracts.erc20({ address, network: this.network });
  }

  async getAddresses(): Promise<string[]> {
    return [this.vaultAddress];
  }

  async getUnderlyingTokenAddresses(_params: GetUnderlyingTokensParams<Erc20>) {
    return this.underlyingTokenAddress;
  }

  async getPricePerShare({ multicall, appToken }: GetPricePerShareParams<Erc20, VaultTokenDataProps>) {
    const underlying = multicall.wrap(this.appToolkit.globalContracts.erc20(appToken.tokens[0]));
    const reserveRaw = await underlying.balanceOf(this.reserveAddress ?? this.vaultAddress);
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    return reserve / appToken.supply;
  }

  async getDataProps({ appToken, multicall }: GetDataPropsParams<Erc20, VaultTokenDataProps>) {
    const underlying = multicall.wrap(this.appToolkit.globalContracts.erc20(appToken.tokens[0]));
    const reserveRaw = await underlying.balanceOf(this.reserveAddress ?? this.vaultAddress);
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    const liquidity = reserve * appToken.tokens[0].price;
    return { reserve, liquidity };
  }
}
