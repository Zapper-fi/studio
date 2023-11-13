import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetPricePerShareParams, GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

import { HakuswapViemContractFactory } from '../contracts';
import { HakuswapXHaku } from '../contracts/viem';

@PositionTemplate()
export class AvalancheHakuswapXHakuTokenFetcher extends AppTokenTemplatePositionFetcher<HakuswapXHaku> {
  groupLabel = 'xHaku';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(HakuswapViemContractFactory) protected readonly contractFactory: HakuswapViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.hakuswapXHaku({ network: this.network, address });
  }

  async getAddresses() {
    return ['0xa95c238b5a72f481f6abd50f951f01891130b441'];
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<HakuswapXHaku>) {
    return [{ address: await contract.read.haku(), network: this.network }];
  }

  async getPricePerShare({ contract, appToken, multicall }: GetPricePerShareParams<HakuswapXHaku>) {
    const oneUnit = BigNumber.from(10).pow(18).toString();
    const pricePerShareRaw = await multicall.wrap(contract).read.xHAKUForHAKU([BigInt(oneUnit)]);
    const decimals = appToken.tokens[0].decimals;

    return [Number(pricePerShareRaw) / 10 ** decimals];
  }
}
