import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { ImpermaxContractFactory, Collateral } from '../contracts';
import { getCollateralAddresses } from '../ethereum/impermax.collateral.token-fetcher';
import { IMPERMAX_DEFINITION } from '../impermax.definition';

import { address } from './impermax.lend.token-fetcher';

const appId = IMPERMAX_DEFINITION.id;
const groupId = IMPERMAX_DEFINITION.groups.collateral.id;
const network = Network.ARBITRUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class ArbitrumImpermaxCollateralTokenFetcher implements PositionFetcher<AppTokenPosition> {
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
        { appId: 'sushiswap', groupIds: ['pool'], network },
        { appId: 'swapr', groupIds: ['pool'], network },
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
