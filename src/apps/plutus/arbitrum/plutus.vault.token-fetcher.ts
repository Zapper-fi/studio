import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { WrapperTemplateTokenFetcher } from '~position/template/wrapper.template.token-fetcher';

@PositionTemplate()
export class ArbitrumPlutusPlsJonesTokenFetcher extends WrapperTemplateTokenFetcher {
  groupLabel = 'plsJONES';

  vaultAddress = '0xe7f6c3c1f0018e4c08acc52965e5cbff99e34a44';
  underlyingTokenAddress = '0xe8ee01ae5959d3231506fcdef2d5f3e85987a39c';
}

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
        address: '0xf236ea74b515ef96a9898f5a4ed4aa591f253ce1', // plsDPX
        underlyingTokenAddress: '0x6c2c06790b3e3e3c38e12ee22f8183b37a13ee55',
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
