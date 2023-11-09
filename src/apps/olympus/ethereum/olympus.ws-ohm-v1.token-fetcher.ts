import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetPricePerShareParams, GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

import { OlympusViemContractFactory } from '../contracts';
import { OlympusWsOhmV1Token } from '../contracts/viem';

@PositionTemplate()
export class EthereumOlympusWsOhmV1TokenFetcher extends AppTokenTemplatePositionFetcher<OlympusWsOhmV1Token> {
  groupLabel = 'wsOHM v1';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(OlympusViemContractFactory) protected readonly contractFactory: OlympusViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.olympusWsOhmV1Token({ address, network: this.network });
  }

  async getAddresses() {
    return ['0xca76543cf381ebbb277be79574059e32108e3e65'];
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<OlympusWsOhmV1Token>) {
    return [{ address: await contract.read.sOHM(), network: this.network }];
  }

  async getPricePerShare({ appToken, multicall }: GetPricePerShareParams<OlympusWsOhmV1Token>) {
    const reserveRaw = await multicall
      .wrap(this.appToolkit.globalViemContracts.erc20(appToken.tokens[0]))
      .read.balanceOf(appToken.address);
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    const pricePerShare = reserve / appToken.supply;
    return [pricePerShare];
  }
}
