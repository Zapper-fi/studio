import { Inject } from '@nestjs/common';
import _ from 'lodash'

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { ImpermaxContractFactory, Borrowable, Factory } from '../contracts';
import { IMPERMAX_DEFINITION } from '../impermax.definition';

const appId = IMPERMAX_DEFINITION.id;
const groupId = IMPERMAX_DEFINITION.groups.lend.id;
const network = Network.POLYGON_MAINNET;
const address = '0xBB92270716C8c424849F17cCc12F4F24AD4064D6'.toLowerCase()

@Register.TokenPositionFetcher({ appId, groupId, network })
export class PolygonImpermaxLendTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(ImpermaxContractFactory) private readonly contractFactory: ImpermaxContractFactory,
  ) { }

  async getPositions() {
    const contract = this.contractFactory.factory({
      address, network
    })
    const multicall = this.appToolkit.getMulticall(network).wrap(contract)

    const poolLength = Number(await multicall.allLendingPoolsLength())
    const collateralAddresses = await Promise.all(_.range(poolLength).map(async i => {
      const poolAddress = await multicall.allLendingPools(i);
      const { initialized, borrowable0, borrowable1 } = await multicall.getLendingPool(poolAddress)
      return initialized ? [borrowable0, borrowable1] : []
    }))

    // Note: Probably not the correct recipe to be using
    const tokens = await this.appToolkit.helpers.vaultTokenHelper.getTokens<Borrowable>({
      appId,
      groupId,
      network: Network.POLYGON_MAINNET,
      resolveVaultAddresses: () => _.flatten(collateralAddresses),
      resolveContract: ({ address, network }) => this.contractFactory.borrowable({ address, network }),
      resolveUnderlyingTokenAddress: ({ multicall, contract }) =>
        multicall
          .wrap(contract)
          .underlying(),
      resolveReserve: () => 0,
      resolvePricePerShare: () => 1, // Note: assumes pool is solvent
    });
    return tokens;
  }
}
