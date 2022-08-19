import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { LyraAvalonContractFactory, LyraStaking } from '../contracts';
import { LYRA_AVALON_DEFINITION } from '../lyra-avalon.definition';

import { STAKING_ADDRESS } from './helpers/consts';

const appId = LYRA_AVALON_DEFINITION.id;
const groupId = LYRA_AVALON_DEFINITION.groups.ve.id;
const network = Network.OPTIMISM_MAINNET;

// Note: Should be a base-token
@Register.TokenPositionFetcher({ appId, groupId, network })
export class OptimismLyraAvalonStakingTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(LyraAvalonContractFactory) private readonly contractFactory: LyraAvalonContractFactory,
  ) {}

  async getPositions() {
    return await this.appToolkit.helpers.vaultTokenHelper.getTokens<LyraStaking>({
      appId,
      groupId,
      network,
      resolveVaultAddresses: () => [STAKING_ADDRESS],
      resolveContract: ({ address, network }) => this.contractFactory.lyraStaking({ address, network }),
      resolveUnderlyingTokenAddress: ({ multicall, contract }) => multicall.wrap(contract).STAKED_TOKEN(),
      resolveReserve: ({ multicall, contract }) => multicall.wrap(contract).totalSupply().then(Number),
      resolvePricePerShare: () => 1,
    });
  }
}
