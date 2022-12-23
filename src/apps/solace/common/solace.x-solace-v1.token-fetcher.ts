import { Inject } from '@nestjs/common';
import 'moment-duration-format';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetPricePerShareParams, GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

import { SolaceContractFactory, XSolacev1 } from '../contracts';

const ONE_UNIT = '1000000000000000000';

export abstract class SolaceXSolacev1TokenFetcher extends AppTokenTemplatePositionFetcher<XSolacev1> {
  abstract xSolaceV1Address: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SolaceContractFactory) protected readonly contractFactory: SolaceContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): XSolacev1 {
    return this.contractFactory.xSolacev1({ network: this.network, address });
  }

  async getAddresses() {
    return [this.xSolaceV1Address];
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<XSolacev1>) {
    return [{ address: await contract.solace(), network: this.network }];
  }

  async getPricePerShare({ contract, appToken, multicall }: GetPricePerShareParams<XSolacev1>) {
    const pricePerShareRaw = await multicall.wrap(contract).xSolaceToSolace(ONE_UNIT);
    const decimals = appToken.tokens[0].decimals;
    return Number(pricePerShareRaw) / 10 ** decimals;
  }
}
