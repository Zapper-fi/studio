import { Inject, Injectable } from '@nestjs/common';
import _ from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';

import { ImpermaxContractFactory, Collateral } from '../contracts';
import { IMPERMAX_DEFINITION } from '../impermax.definition';

const appId = IMPERMAX_DEFINITION.id;
const groupId = IMPERMAX_DEFINITION.groups.collateral.id;

export const getCollateralAddresses = async multicall => {
  const poolLength = Number(await multicall.allLendingPoolsLength());
  const collateralAddresses = await Promise.all(
    _.range(poolLength).map(async i => {
      const poolAddress = await multicall.allLendingPools(i);
      const { initialized, collateral } = await multicall.getLendingPool(poolAddress);
      return initialized ? [collateral] : [];
    }),
  );
  return _.flatten(collateralAddresses);
};

@Injectable()
export class ImpermaxCollateralTokenHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(ImpermaxContractFactory) private readonly contractFactory: ImpermaxContractFactory,
  ) {}

  async getPositions({ address, network, dependencies }) {
    const contract = this.contractFactory.factory({ address, network });
    const multicall = this.appToolkit.getMulticall(network).wrap(contract);
    const collateralAddresses = await getCollateralAddresses(multicall);

    const tokens = await this.appToolkit.helpers.vaultTokenHelper.getTokens<Collateral>({
      appId,
      groupId,
      network,
      dependencies,
      resolveVaultAddresses: () => collateralAddresses,
      resolveContract: ({ address, network }) => this.contractFactory.collateral({ address, network }),
      resolveUnderlyingTokenAddress: ({ multicall, contract }) => multicall.wrap(contract).underlying(),
      resolveReserve: () => 0,
      resolvePricePerShare: () => 1, // Note: assumes not liquidated
    });

    return tokens;
  }
}
