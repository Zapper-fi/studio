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

  async getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensParams<CaskVaultToken>) {
    return contract.getBaseAsset();
  }

  async getPricePerShare({ appToken, contract }: GetPricePerShareParams<CaskVaultToken>) {
    return contract.pricePerShare().then(v => Number(v) / 10 ** appToken.tokens[0].decimals);
  }

  async getLabel() {
    return 'Cask Wallet';
  }
}
