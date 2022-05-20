import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { UNISWAP_V2_DEFINITION } from '~apps/uniswap-v2/uniswap-v2.definition';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { ImpermaxContractFactory, Collateral } from '../contracts';
import { IMPERMAX_DEFINITION } from '../impermax.definition';

import { address } from './impermax.lend.token-fetcher';

const appId = IMPERMAX_DEFINITION.id;
const groupId = IMPERMAX_DEFINITION.groups.collateral.id;
const network = Network.ETHEREUM_MAINNET;

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

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumImpermaxCollateralTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(ImpermaxContractFactory) private readonly contractFactory: ImpermaxContractFactory,
  ) {}

  async getPositions() {
    const contract = this.contractFactory.factory({ address, network });
    const multicall = this.appToolkit.getMulticall(network).wrap(contract);
    const collateralAddresses = await getCollateralAddresses(multicall);

    const tokens = await this.appToolkit.helpers.vaultTokenHelper.getTokens<Collateral>({
      appId,
      groupId,
      network,
      dependencies: [
        {
          appId: UNISWAP_V2_DEFINITION.id,
          groupIds: [UNISWAP_V2_DEFINITION.groups.pool.id],
          network,
        },
      ],
      resolveVaultAddresses: () => collateralAddresses,
      resolveContract: ({ address, network }) => this.contractFactory.collateral({ address, network }),
      resolveUnderlyingTokenAddress: ({ multicall, contract }) => multicall.wrap(contract).underlying(),
      resolveReserve: () => 0,
      resolvePricePerShare: () => 1, // Note: assumes not liquidated
    });
    return tokens;
  }
}
