import { Erc20 } from '~contract/contracts';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetDataPropsParams, GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

export abstract class WrapperTemplateTokenFetcher extends AppTokenTemplatePositionFetcher<Erc20> {
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

  async getPricePerShare() {
    return 1;
  }

  async getLiquidity({ appToken }: GetDataPropsParams<Erc20>) {
    return appToken.supply * appToken.price;
  }

  async getReserves({ appToken, multicall }: GetDataPropsParams<Erc20>) {
    const underlying = multicall.wrap(this.appToolkit.globalContracts.erc20(appToken.tokens[0]));
    const reserveRaw = await underlying.balanceOf(this.vaultAddress);
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    return [reserve];
  }

  async getApy() {
    return 0;
  }
}
