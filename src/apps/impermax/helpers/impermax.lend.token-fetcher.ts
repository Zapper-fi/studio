import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetAddressesParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { ImpermaxContractFactory, Borrowable } from '../contracts';

export abstract class ImpermaxLendTokenFetcher extends AppTokenTemplatePositionFetcher<Borrowable> {
  abstract factoryAddress: string;

  constructor(
    @Inject(APP_TOOLKIT) readonly appToolkit: IAppToolkit,
    @Inject(ImpermaxContractFactory) private readonly contractFactory: ImpermaxContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): Borrowable {
    return this.contractFactory.borrowable({ address, network: this.network });
  }

  async getAddresses({ multicall }: GetAddressesParams): Promise<string[]> {
    const factoryContract = multicall.wrap(
      this.contractFactory.factory({ network: this.network, address: this.factoryAddress }),
    );

    const poolLength = await factoryContract.allLendingPoolsLength().then(length => Number(length));
    const collateralAddresses = await Promise.all(
      _.range(poolLength).map(async i => {
        const poolAddress = await factoryContract.allLendingPools(i);
        const { initialized, borrowable0, borrowable1 } = await factoryContract.getLendingPool(poolAddress);
        return initialized ? [borrowable0.toLowerCase(), borrowable1.toLowerCase()] : [];
      }),
    );

    return _.flatten(collateralAddresses);
  }

  async getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensParams<Borrowable>) {
    return contract.underlying();
  }

  async getPricePerShare({ contract, appToken }: GetPricePerShareParams<Borrowable>) {
    const [underlyingToken] = appToken.tokens;
    const exchangeRate = await contract.exchangeRateLast();
    return Number(exchangeRate) / 10 ** underlyingToken.decimals;
  }
}
