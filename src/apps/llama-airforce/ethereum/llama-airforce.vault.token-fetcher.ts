import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { LlamaAirforceContractFactory, LlamaAirforceUnionVault } from '../contracts';

export type LlamaAirforceVaultTokenDataProps = {
  reserve: number;
  liquidity: number;
};

@PositionTemplate()
export class EthereumLlamaAirforceVaultTokenFetcher extends AppTokenTemplatePositionFetcher<
  LlamaAirforceUnionVault,
  LlamaAirforceVaultTokenDataProps
> {
  groupLabel = 'Vaults';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(LlamaAirforceContractFactory) protected readonly contractFactory: LlamaAirforceContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): LlamaAirforceUnionVault {
    return this.contractFactory.llamaAirforceUnionVault({ address, network: this.network });
  }

  getAddresses() {
    return [
      '0x83507cc8c8b67ed48badd1f59f684d5d02884c81', // uCRV
      '0xf964b0e3ffdea659c44a5a52bc0b82a24b89ce0e', // uFXS
      '0x8659fc767cad6005de79af65dafe4249c57927af', // uCVX
      '0xd6fc1ecd9965ba9cac895654979564a291c74c29', // uauraBAL
    ];
  }

  async getUnderlyingTokenAddresses({
    address,
    contract,
    multicall,
  }: GetUnderlyingTokensParams<LlamaAirforceUnionVault>) {
    if (address === '0x8659fc767cad6005de79af65dafe4249c57927af') {
      const pirexContract = this.contractFactory.llamaAirforceUnionVaultPirex({ address, network: this.network });
      return multicall.wrap(pirexContract).asset();
    }

    return contract.underlying();
  }

  async getPricePerShare({ contract, appToken, multicall }: GetPricePerShareParams<LlamaAirforceUnionVault>) {
    if (appToken.address === '0x8659fc767cad6005de79af65dafe4249c57927af') {
      const pirexContract = this.contractFactory.llamaAirforceUnionVaultPirex({
        address: appToken.address,
        network: this.network,
      });

      const reserveRaw = await multicall.wrap(pirexContract).totalAssets();
      const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
      return reserve / appToken.supply;
    }

    const reserveRaw = await contract.totalUnderlying();
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    return reserve / appToken.supply;
  }

  async getDataProps({
    appToken,
  }: GetDataPropsParams<LlamaAirforceUnionVault>): Promise<LlamaAirforceVaultTokenDataProps> {
    const reserve = appToken.pricePerShare[0] * appToken.supply;
    const liquidity = reserve * appToken.price;
    return { reserve, liquidity };
  }

  async getLabel({ appToken }: GetDisplayPropsParams<LlamaAirforceUnionVault, LlamaAirforceVaultTokenDataProps>) {
    return `${getLabelFromToken(appToken.tokens[0])} Pounder`;
  }
}
