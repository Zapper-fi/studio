import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetDisplayPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { CaskProtocolViemContractFactory } from '../contracts';
import { CaskVaultToken } from '../contracts/viem';

export abstract class CaskProtocolWalletTokenFetcher extends AppTokenTemplatePositionFetcher<CaskVaultToken> {
  abstract caskVaultContractAddress: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CaskProtocolViemContractFactory) protected readonly contractFactory: CaskProtocolViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.caskVaultToken({ address, network: this.network });
  }

  async getAddresses() {
    return [this.caskVaultContractAddress];
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<CaskVaultToken>) {
    return [{ address: await contract.read.getBaseAsset(), network: this.network }];
  }

  async getPricePerShare({ appToken, contract }: GetPricePerShareParams<CaskVaultToken>) {
    const pricePerShareRaw = await contract.read.pricePerShare();
    const pricePerShare = Number(pricePerShareRaw) / 10 ** appToken.tokens[0].decimals;
    return [pricePerShare];
  }

  async getLabel({ appToken }: GetDisplayPropsParams<CaskVaultToken>) {
    return getLabelFromToken(appToken.tokens[0]);
  }
}
