import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { ImpermaxContractFactory, Borrowable } from '../contracts';
import { IMPERMAX_DEFINITION } from '../impermax.definition';

const appId = IMPERMAX_DEFINITION.id;
const groupId = IMPERMAX_DEFINITION.groups.lend.id;
const network = Network.ETHEREUM_MAINNET;
const address = '0x8C3736e2FE63cc2cD89Ee228D9dBcAb6CE5B767B'.toLowerCase();

export const getCollateralAddresses = async multicall => {
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

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumImpermaxLendTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(ImpermaxContractFactory) private readonly contractFactory: ImpermaxContractFactory,
  ) {}

  async getPositions() {
    const contract = this.contractFactory.factory({ address, network });
    const multicall = this.appToolkit.getMulticall(network).wrap(contract);
    const collateralAddresses = await getCollateralAddresses(multicall);

    const tokens = await this.appToolkit.helpers.vaultTokenHelper.getTokens<Borrowable>({
      appId,
      groupId,
      network,
      resolveVaultAddresses: () => collateralAddresses,
      resolveContract: ({ address, network }) => this.contractFactory.borrowable({ address, network }),
      resolveUnderlyingTokenAddress: ({ multicall, contract }) => multicall.wrap(contract).underlying(),
      resolveReserve: () => 0,
      resolvePricePerShare: () => 1, // Note: assumes pool is solvent
    });
    return tokens;
  }
}
