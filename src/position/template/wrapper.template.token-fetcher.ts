import { Erc20 } from '~contract/contracts/viem';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetDataPropsParams, GetUnderlyingTokensParams } from '~position/template/app-token.template.types';
import { Network } from '~types';

export abstract class WrapperTemplateTokenFetcher extends AppTokenTemplatePositionFetcher<Erc20> {
  abstract vaultAddress: string;
  abstract underlyingTokenAddress: string;
  fromNetwork: Network;

  getContract(address: string) {
    return this.appToolkit.globalViemContracts.erc20({ address, network: this.network });
  }

  async getAddresses(): Promise<string[]> {
    return [this.vaultAddress];
  }

  async getUnderlyingTokenDefinitions(_params: GetUnderlyingTokensParams<Erc20>) {
    return [{ address: this.underlyingTokenAddress, network: this.fromNetwork ?? this.network }];
  }

  async getPricePerShare() {
    return [1];
  }

  async getLiquidity({ appToken }: GetDataPropsParams<Erc20>) {
    return appToken.supply * appToken.price;
  }

  async getReserves({ appToken }: GetDataPropsParams<Erc20>) {
    return [appToken.pricePerShare[0] * appToken.supply];
  }

  async getApy() {
    return 0;
  }
}
