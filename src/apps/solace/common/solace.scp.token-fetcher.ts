import { Inject } from '@nestjs/common';
import 'moment-duration-format';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetPricePerShareParams } from '~position/template/app-token.template.types';

import { Scp, SolaceContractFactory } from '../contracts';

export abstract class SolaceScpTokenFetcher extends AppTokenTemplatePositionFetcher<Scp> {
  abstract scpAddress: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SolaceContractFactory) protected readonly contractFactory: SolaceContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): Scp {
    return this.contractFactory.scp({ network: this.network, address });
  }

  async getAddresses() {
    return [this.scpAddress];
  }

  async getUnderlyingTokenDefinitions() {
    return [{ address: ZERO_ADDRESS, network: this.network }];
  }

  async getPricePerShare({ contract, appToken, multicall }: GetPricePerShareParams<Scp>) {
    const pricePerShareRaw = await multicall.wrap(contract).pricePerShare();
    const decimals = appToken.tokens[0].decimals;
    return Number(pricePerShareRaw) / 10 ** decimals;
  }
}
