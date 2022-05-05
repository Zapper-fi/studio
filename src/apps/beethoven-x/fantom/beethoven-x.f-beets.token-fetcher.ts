import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { BEETHOVEN_X_DEFINITION } from '../beethoven-x.definition';
import { BeethovenXContractFactory } from '../contracts';

const F_BEETS_ADDRESS = '0xfcef8a994209d6916eb2c86cdd2afd60aa6f54b1';
const BPT_BEETS_FTM_POOL_ADDRESS = '0xcde5a11a4acb4ee4c805352cec57e236bdbc3837';

const appId = BEETHOVEN_X_DEFINITION.id;
const groupId = BEETHOVEN_X_DEFINITION.groups.fBeets.id;
const network = Network.FANTOM_OPERA_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class FantomBeethovenXFBeetsTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(BeethovenXContractFactory)
    private readonly beethovenXContractFactory: BeethovenXContractFactory,
  ) {}

  async getPositions(): Promise<AppTokenPosition[]> {
    return this.appToolkit.helpers.singleVaultTokenHelper.getTokens({
      network,
      appId,
      groupId,
      dependencies: [{ appId, groupIds: [BEETHOVEN_X_DEFINITION.groups.pool.id], network }],
      address: F_BEETS_ADDRESS,
      resolveContract: ({ address, network }) => this.beethovenXContractFactory.erc20({ address, network }),
      resolveUnderlyingTokenAddress: () => BPT_BEETS_FTM_POOL_ADDRESS,
      resolveImages: () => [getTokenImg(BEETHOVEN_X_DEFINITION.token!.address, network)],
    });
  }
}
