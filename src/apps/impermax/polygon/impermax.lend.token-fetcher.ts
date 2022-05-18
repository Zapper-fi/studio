import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { ImpermaxContractFactory, Borrowable } from '../contracts';
import { getCollateralAddresses } from '../ethereum/impermax.lend.token-fetcher';
import { IMPERMAX_DEFINITION } from '../impermax.definition';

const appId = IMPERMAX_DEFINITION.id;
const groupId = IMPERMAX_DEFINITION.groups.lend.id;
const network = Network.POLYGON_MAINNET;
const address = '0xBB92270716C8c424849F17cCc12F4F24AD4064D6'.toLowerCase();

@Register.TokenPositionFetcher({ appId, groupId, network })
export class PolygonImpermaxLendTokenFetcher implements PositionFetcher<AppTokenPosition> {
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
