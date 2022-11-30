import { Inject, Injectable } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetPricePerShareParams, GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

import { TempusContractFactory, TempusPyToken } from '../contracts';

import { getTempusData } from './tempus.datasource';

@Injectable()
export abstract class TempusPoolTokenFetcher extends AppTokenTemplatePositionFetcher<TempusPyToken> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(TempusContractFactory) protected readonly contractFactory: TempusContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): TempusPyToken {
    return this.contractFactory.tempusPyToken({ address, network: this.network });
  }

  async getAddresses() {
    const data = await getTempusData(this.network);
    return data.tempusPools.flatMap(v => [v.principalsAddress, v.yieldsAddress]);
  }

  async getUnderlyingTokenAddresses({ contract, multicall }: GetUnderlyingTokensParams<TempusPyToken>) {
    const poolAddress = await contract.pool();
    const pool = multicall.wrap(this.contractFactory.tempusPool({ address: poolAddress, network: this.network }));
    return [await pool.backingToken()];
  }

  async getPricePerShare({ contract, appToken }: GetPricePerShareParams<TempusPyToken>) {
    const pricePerShareRaw = await contract.getPricePerFullShareStored();
    return Number(pricePerShareRaw) / 10 ** Number(appToken.decimals);
  }
}
