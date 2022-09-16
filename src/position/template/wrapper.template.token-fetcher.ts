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

  getReserves({ appToken }: GetDataPropsParams<Erc20>) {
    return [appToken.pricePerShare[0] * appToken.supply];
  }

  async getApy() {
    return 0;
  }
}
