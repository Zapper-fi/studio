import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetDisplayPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { LlamaAirforceContractFactory, LlamaAirforceUnionVault } from '../contracts';

@PositionTemplate()
export class EthereumLlamaAirforceVaultTokenFetcher extends AppTokenTemplatePositionFetcher<LlamaAirforceUnionVault> {
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
      '0x4ebad8dbd4edbd74db0278714fbd67ebc76b89b7', // uCRV V2
      '0xde2bef0a01845257b4aef2a2eaa48f6eaeafa8b7', // uCRV V3
      '0xf964b0e3ffdea659c44a5a52bc0b82a24b89ce0e', // uFXS
      '0x3a886455e5b33300a31c5e77bac01e76c0c7b29c', // uFXS V2
      '0x8659fc767cad6005de79af65dafe4249c57927af', // uCVX
      '0xd6fc1ecd9965ba9cac895654979564a291c74c29', // uauraBAL
      '0x8c4eb0fc6805ee7337ac126f89a807271a88dd67', // uauraBAL v2
    ];
  }

  async getUnderlyingTokenDefinitions({
    address,
    contract,
    multicall,
  }: GetUnderlyingTokensParams<LlamaAirforceUnionVault>) {
    if (address === '0x8659fc767cad6005de79af65dafe4249c57927af') {
      const pirexContract = this.contractFactory.llamaAirforceUnionVaultPirex({ address, network: this.network });
      return [{ address: await multicall.wrap(pirexContract).asset(), network: this.network }];
    }

    return [{ address: await contract.underlying(), network: this.network }];
  }

  async getPricePerShare({ contract, appToken, multicall }: GetPricePerShareParams<LlamaAirforceUnionVault>) {
    if (appToken.address === '0x8659fc767cad6005de79af65dafe4249c57927af') {
      const pirexContract = this.contractFactory.llamaAirforceUnionVaultPirex({
        address: appToken.address,
        network: this.network,
      });

      const reserveRaw = await multicall.wrap(pirexContract).totalAssets();
      const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
      const pricePerShare = reserve / appToken.supply;
      return [pricePerShare];
    }

    const reserveRaw = await contract.totalUnderlying();
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    const pricePerShare = reserve / appToken.supply;
    return [pricePerShare];
  }

  async getLabel({ appToken }: GetDisplayPropsParams<LlamaAirforceUnionVault>) {
    return `${getLabelFromToken(appToken.tokens[0])} Pounder`;
  }
}
