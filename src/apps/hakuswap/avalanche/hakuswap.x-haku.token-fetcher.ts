import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetPricePerShareParams, GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

import { HakuswapContractFactory, HakuswapXHaku } from '../contracts';

@PositionTemplate()
export class AvalancheHakuswapXHakuTokenFetcher extends AppTokenTemplatePositionFetcher<HakuswapXHaku> {
  groupLabel = 'xHaku';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(HakuswapContractFactory) protected readonly contractFactory: HakuswapContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): HakuswapXHaku {
    return this.contractFactory.hakuswapXHaku({ network: this.network, address });
  }

  async getAddresses() {
    return ['0xa95c238b5a72f481f6abd50f951f01891130b441'];
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<HakuswapXHaku>) {
    return [{ address: await contract.haku(), network: this.network }];
  }

  async getPricePerShare({ contract, appToken, multicall }: GetPricePerShareParams<HakuswapXHaku>) {
    const oneUnit = BigNumber.from(10).pow(18);
    const pricePerShareRaw = await multicall.wrap(contract).xHAKUForHAKU(oneUnit);
    const decimals = appToken.tokens[0].decimals;

    return [Number(pricePerShareRaw) / 10 ** decimals];
  }
}
