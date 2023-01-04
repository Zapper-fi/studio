import { Inject } from '@nestjs/common';
import 'moment-duration-format';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetPricePerShareParams,
  DefaultAppTokenDataProps,
  DefaultAppTokenDefinition,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { LidoContractFactory, Wsteth } from '../contracts';

@PositionTemplate()
export class EthereumLidoWstethTokenFetcher extends AppTokenTemplatePositionFetcher<Wsteth> {
  groupLabel = 'wstETH';
  isExcludedFromBalances = true;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(LidoContractFactory) protected readonly contractFactory: LidoContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): Wsteth {
    return this.contractFactory.wsteth({ network: this.network, address });
  }

  async getAddresses() {
    return ['0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0'];
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<Wsteth>) {
    return [{ address: await contract.stETH(), network: this.network }];
  }

  async getPricePerShare({
    appToken,
    contract,
  }: GetPricePerShareParams<Wsteth, DefaultAppTokenDataProps, DefaultAppTokenDefinition>) {
    const pricePerShareRaw = await contract.stEthPerToken();

    return Number(pricePerShareRaw) / 10 ** appToken.decimals;
  }
}
