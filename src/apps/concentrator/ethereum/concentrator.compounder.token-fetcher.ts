import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetDataPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { AbcCvx, AladdinConcentratorCompounder, ConcentratorContractFactory } from '../contracts';

@PositionTemplate()
export class EthereumConcentratorCompounderTokenFetcher extends AppTokenTemplatePositionFetcher<AladdinConcentratorCompounder> {
  groupLabel = 'Compounder';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ConcentratorContractFactory) protected readonly contractFactory: ConcentratorContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): AladdinConcentratorCompounder {
    return this.contractFactory.aladdinConcentratorCompounder({ address, network: this.network });
  }

  getAddresses() {
    return [
      '0x2b95a1dcc3d405535f9ed33c219ab38e8d7e0884', // aCRV
      '0xb15ad6113264094fd9bf2238729410a07ebe5aba', // afrxETH
      '0xdaf03d70fe637b91ba6e521a32e1fb39256d3ec9', // aFXS
      '0x43e54c2e7b3e294de3a155785f52ab49d87b9922', // asdCRV
    ];
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<AladdinConcentratorCompounder>) {
    return [{ address: await contract.asset(), network: this.network }];
  }

  async getPricePerShare({ appToken, contract }: GetPricePerShareParams<AladdinConcentratorCompounder>) {
    const reserveRaw = await contract.totalAssets();
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    const pricePerShare = appToken.supply > 0 ? reserve / appToken.supply : 0;
    return [pricePerShare];
  }
}
