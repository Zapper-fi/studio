import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetAddressesParams,
  GetDataPropsParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { ImpermaxContractFactory, Collateral } from '../contracts';

export abstract class ImpermaxCollateralTokenFetcher extends AppTokenTemplatePositionFetcher<Collateral> {
  abstract factoryAddress: string;

  constructor(
    @Inject(APP_TOOLKIT) readonly appToolkit: IAppToolkit,
    @Inject(ImpermaxContractFactory) private readonly contractFactory: ImpermaxContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): Collateral {
    return this.contractFactory.collateral({ address, network: this.network });
  }

  async getAddresses({ multicall }: GetAddressesParams): Promise<string[]> {
    const factoryContract = multicall.wrap(
      this.contractFactory.factory({ network: this.network, address: this.factoryAddress }),
    );

    const poolLength = await factoryContract.allLendingPoolsLength().then(length => Number(length));
    const collateralAddresses = await Promise.all(
      _.range(poolLength).map(async i => {
        const poolAddress = await factoryContract.allLendingPools(i);
        const { initialized, collateral } = await factoryContract.getLendingPool(poolAddress);
        return initialized ? collateral : null;
      }),
    );

    return _.compact(collateralAddresses);
  }

  async getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensParams<Collateral>) {
    return contract.underlying();
  }

  async getLiquidity({ appToken }: GetDataPropsParams<Collateral>) {
    return appToken.supply * appToken.price;
  }

  async getReserves({ appToken }: GetDataPropsParams<Collateral>) {
    return [appToken.pricePerShare[0] * appToken.supply];
  }

  async getApy() {
    return 0;
  }
}
