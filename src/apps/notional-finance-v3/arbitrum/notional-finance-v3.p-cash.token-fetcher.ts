import { Inject } from '@nestjs/common';
import { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDefinition,
  GetAddressesParams,
  GetDefinitionsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
  UnderlyingTokenDefinition,
} from '~position/template/app-token.template.types';

import { NotionalFinanceV3ViemContractFactory } from '../contracts';
import { NotionalPCash } from '../contracts/viem';

@PositionTemplate()
export class ArbitrumNotionalFinanceV3PCashTokenFetcher extends AppTokenTemplatePositionFetcher<NotionalPCash> {
  groupLabel = 'Supply';
  notionalViewContractAddress = '0x1344a36a1b56144c3bc62e7757377d288fde0369';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(NotionalFinanceV3ViemContractFactory)
    protected readonly contractFactory: NotionalFinanceV3ViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.notionalPCash({ network: this.network, address });
  }

  async getDefinitions({ multicall }: GetDefinitionsParams): Promise<DefaultAppTokenDefinition[]> {
    const notionalViewContract = this.contractFactory.notionalView({
      address: this.notionalViewContractAddress,
      network: this.network,
    });
    const maxCurrencyId = await multicall.wrap(notionalViewContract).read.getMaxCurrencyId();

    return await Promise.all(
      range(1, maxCurrencyId + 1).map(async currencyId => {
        const address = await multicall.wrap(notionalViewContract).read.pCashAddress([currencyId]);

        return {
          address,
        };
      }),
    );
  }

  async getAddresses({ definitions }: GetAddressesParams<DefaultAppTokenDefinition>) {
    return definitions.map(x => x.address);
  }

  async getUnderlyingTokenDefinitions({
    contract,
  }: GetUnderlyingTokensParams<NotionalPCash>): Promise<UnderlyingTokenDefinition[]> {
    return [{ address: await contract.read.asset(), network: this.network }];
  }

  async getPricePerShare({ appToken, contract }: GetPricePerShareParams<NotionalPCash>) {
    const pricePerShareRaw = await contract.read.exchangeRate();
    const pricePerShare = Number(pricePerShareRaw) / 10 ** (10 + appToken.tokens[0].decimals);

    return [pricePerShare];
  }
}
