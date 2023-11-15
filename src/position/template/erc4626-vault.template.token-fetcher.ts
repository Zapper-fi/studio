import { Erc4626 } from '~contract/contracts/viem';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';

import { GetDataPropsParams, GetPricePerShareParams, GetUnderlyingTokensParams } from './app-token.template.types';

export abstract class Erc4626VaultTemplateTokenFetcher extends AppTokenTemplatePositionFetcher<Erc4626> {
  abstract get vaultAddress(): string | Promise<string>;

  getContract(address: string) {
    return this.appToolkit.globalViemContracts.erc4626({ address, network: this.network });
  }

  async getAddresses(): Promise<string[]> {
    const vaultAddress = await this.vaultAddress;
    return [vaultAddress];
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<Erc4626>) {
    const underlyingToken = await contract.read.asset();
    return [{ address: underlyingToken, network: this.network }];
  }

  async getPricePerShare({ contract, appToken }: GetPricePerShareParams<Erc4626>) {
    const reserveRaw = await contract.read.totalAssets();
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    const pricePerShare = reserve / appToken.supply;
    return [pricePerShare];
  }

  async getLiquidity({ contract, appToken }: GetDataPropsParams<Erc4626>) {
    const reserveRaw = await contract.read.totalAssets();
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    const liquidity = reserve * appToken.tokens[0].price;
    return liquidity;
  }

  async getReserves({ contract, appToken }: GetDataPropsParams<Erc4626>) {
    const reserveRaw = await contract.read.totalAssets();
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    return [reserve];
  }
}
