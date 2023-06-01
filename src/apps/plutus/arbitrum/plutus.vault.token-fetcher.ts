import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { Erc20 } from '~contract/contracts';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  GetAddressesParams,
  GetDataPropsParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

export type PlutusVaultAppTokenDefinition = {
  address: string;
  underlyingTokenAddress: string;
};

@PositionTemplate()
export class ArbitrumPlutusVaultTokenFetcher extends AppTokenTemplatePositionFetcher<
  Erc20,
  DefaultAppTokenDataProps,
  PlutusVaultAppTokenDefinition
> {
  groupLabel = 'Vault';

  getContract(address: string): Erc20 {
    return this.appToolkit.globalContracts.erc20({ address, network: this.network });
  }

  async getDefinitions(): Promise<PlutusVaultAppTokenDefinition[]> {
    return [
      {
        address: '0xe7f6c3c1f0018e4c08acc52965e5cbff99e34a44', // plsJONES
        underlyingTokenAddress: '0xe8ee01ae5959d3231506fcdef2d5f3e85987a39c',
      },
      {
        address: '0x530f1cbb2ebd71bec58d351dcd3768148986a467', // plsGLP
        underlyingTokenAddress: '0x4277f8f2c384827b5273592ff7cebd9f2c1ac258',
      },
      {
        address: '0x7a5d193fe4ed9098f7eadc99797087c96b002907', // plsARB
        underlyingTokenAddress: '0x912ce59144191c1204e64559fe8253a0e49e6548',
      },
    ];
  }

  async getAddresses({ definitions }: GetAddressesParams<PlutusVaultAppTokenDefinition>): Promise<string[]> {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenDefinitions({ definition }: GetUnderlyingTokensParams<Erc20, PlutusVaultAppTokenDefinition>) {
    return [{ address: definition.underlyingTokenAddress, network: this.network }];
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
