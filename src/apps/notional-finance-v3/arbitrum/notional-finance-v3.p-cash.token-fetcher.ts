import { Inject } from '@nestjs/common';
import { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  DefaultAppTokenDefinition,
  GetAddressesParams,
  GetDefinitionsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
  UnderlyingTokenDefinition,
} from '~position/template/app-token.template.types';

import { NotionalFinanceV3ContractFactory, NotionalPCash } from '../contracts';

export type NotionalFinanceV3PCashTokenDefinition = {
  address: string;
  currencyId: number;
};

@PositionTemplate()
export class ArbitrumNotionalFinanceV3PCashTokenFetcher extends AppTokenTemplatePositionFetcher<
  NotionalPCash,
  DefaultAppTokenDataProps,
  NotionalFinanceV3PCashTokenDefinition
> {
  groupLabel = 'Supply';
  notionalViewContractAddress = '0x1344a36a1b56144c3bc62e7757377d288fde0369';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(NotionalFinanceV3ContractFactory) protected readonly contractFactory: NotionalFinanceV3ContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): NotionalPCash {
    return this.contractFactory.notionalPCash({ network: this.network, address });
  }

  async getDefinitions({ multicall }: GetDefinitionsParams): Promise<NotionalFinanceV3PCashTokenDefinition[]> {
    const notionalViewContract = this.contractFactory.notionalView({
      address: this.notionalViewContractAddress,
      network: this.network,
    });
    const maxCurrencyId = await multicall.wrap(notionalViewContract).getMaxCurrencyId();

    return await Promise.all(
      range(1, maxCurrencyId + 1).map(async currencyId => {
        const address = await multicall.wrap(notionalViewContract).pCashAddress(currencyId);

        return {
          address,
          currencyId,
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
    return [{ address: await contract.asset(), network: this.network }];
  }

  async getPricePerShare({
    appToken,
    contract,
  }: GetPricePerShareParams<NotionalPCash, DefaultAppTokenDataProps, NotionalFinanceV3PCashTokenDefinition>) {
    const pricePerShareRaw = await contract.exchangeRate();
    const pricePerShare = Number(pricePerShareRaw) / 10 ** 10 + appToken.tokens[0].decimals;

    return [pricePerShare];
  }
}
