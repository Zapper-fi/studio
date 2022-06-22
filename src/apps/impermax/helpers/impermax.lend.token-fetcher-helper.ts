import { Inject, Injectable } from '@nestjs/common';
import _ from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';

import { ImpermaxContractFactory, Borrowable } from '../contracts';
import { IMPERMAX_DEFINITION } from '../impermax.definition';

const appId = IMPERMAX_DEFINITION.id;
const groupId = IMPERMAX_DEFINITION.groups.lend.id;

const getBorrowAddresses = async multicall => {
  const poolLength = Number(await multicall.allLendingPoolsLength());
  const collateralAddresses = await Promise.all(
    _.range(poolLength).map(async i => {
      const poolAddress = await multicall.allLendingPools(i);
      const { initialized, borrowable0, borrowable1 } = await multicall.getLendingPool(poolAddress);
      return initialized ? [borrowable0, borrowable1] : [];
    }),
  );
  return _.flatten(collateralAddresses);
};

@Injectable()
export class ImpermaxLendTokenHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(ImpermaxContractFactory) private readonly contractFactory: ImpermaxContractFactory,
  ) {}

  async getPositions({ address, network }) {
    const contract = this.contractFactory.factory({ address, network });
    const multicall = this.appToolkit.getMulticall(network).wrap(contract);
    const collateralAddresses = await getBorrowAddresses(multicall);

    const tokens = await this.appToolkit.helpers.vaultTokenHelper.getTokens<Borrowable>({
      appId,
      groupId,
      network,
      resolveVaultAddresses: () => collateralAddresses,
      resolveContract: ({ address, network }) => this.contractFactory.borrowable({ address, network }),
      resolveUnderlyingTokenAddress: ({ multicall, contract }) => multicall.wrap(contract).underlying(),
      resolveReserve: () => 0,
      resolvePricePerShare: ({ multicall, contract, underlyingToken }) =>
        multicall
          .wrap(contract)
          .exchangeRateLast()
          .then(rate => Number(rate) / 10 ** underlyingToken.decimals),
    });
    return tokens;
  }
}
