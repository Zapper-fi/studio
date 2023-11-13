import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetAddressesParams, GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

import { ImpermaxViemContractFactory } from '../contracts';
import { Collateral } from '../contracts/viem';

export abstract class ImpermaxCollateralTokenFetcher extends AppTokenTemplatePositionFetcher<Collateral> {
  abstract factoryAddress: string;

  constructor(
    @Inject(APP_TOOLKIT) readonly appToolkit: IAppToolkit,
    @Inject(ImpermaxViemContractFactory) private readonly contractFactory: ImpermaxViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.collateral({ address, network: this.network });
  }

  async getAddresses({ multicall }: GetAddressesParams): Promise<string[]> {
    const factoryContract = multicall.wrap(
      this.contractFactory.factory({ network: this.network, address: this.factoryAddress }),
    );

    const poolLength = await factoryContract.read.allLendingPoolsLength().then(length => Number(length));
    const collateralAddresses = await Promise.all(
      _.range(poolLength).map(async i => {
        const poolAddress = await factoryContract.read.allLendingPools([BigInt(i)]);
        const [initialized, , collateral] = await factoryContract.read.getLendingPool([poolAddress]);
        return initialized ? collateral : null;
      }),
    );

    return _.compact(collateralAddresses);
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<Collateral>) {
    return [{ address: await contract.read.underlying(), network: this.network }];
  }

  async getPricePerShare() {
    return [1];
  }
}
