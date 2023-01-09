import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetPricePerShareParams, GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

import { CaskProtocolContractFactory, CaskVaultToken } from '../contracts';

export abstract class CaskProtocolWalletTokenFetcher extends AppTokenTemplatePositionFetcher<CaskVaultToken> {
  abstract caskVaultContractAddress: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CaskProtocolContractFactory) protected readonly contractFactory: CaskProtocolContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): CaskVaultToken {
    return this.contractFactory.caskVaultToken({ address, network: this.network });
  }

  async getAddresses() {
    return [this.caskVaultContractAddress];
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<CaskVaultToken>) {
    return [{ address: await contract.getBaseAsset(), network: this.network }];
  }

  async getPricePerShare({ appToken, contract }: GetPricePerShareParams<CaskVaultToken>) {
    const pricePerShareRaw = await contract.pricePerShare();
    const pricePerShare = Number(pricePerShareRaw) / 10 ** appToken.tokens[0].decimals;
    return [pricePerShare];
  }

  async getLabel() {
    return 'Cask Wallet';
  }
}
