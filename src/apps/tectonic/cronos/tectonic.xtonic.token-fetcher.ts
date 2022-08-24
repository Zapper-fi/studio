import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { TectonicContractFactory, TectonicXtonic } from '../contracts';
import { TECTONIC_DEFINITION } from '../tectonic.definition';

const appId = TECTONIC_DEFINITION.id;
const groupId = TECTONIC_DEFINITION.groups.xtonic.id;
const network = Network.CRONOS_MAINNET;
const TONIC_ADDRESS = '0xdd73dea10abc2bff99c60882ec5b2b81bb1dc5b2';

@Register.TokenPositionFetcher({ appId, groupId, network })
export class CronosTectonicXTonicTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(TectonicContractFactory) private readonly tectonicContractFactory: TectonicContractFactory,
  ) {}

  async getPositions() {
    return this.appToolkit.helpers.vaultTokenHelper.getTokens<TectonicXtonic>({
      appId,
      groupId,
      network,
      resolveContract: ({ address, network }) => this.tectonicContractFactory.tectonicXtonic({ address, network }),
      resolveVaultAddresses: () => ['0x1bc9b7d4be47b76965a3f8e910b9ddd83150840f'],
      resolveUnderlyingTokenAddress: () => TONIC_ADDRESS, // TONIC
      resolveReserve: async () => {
        const tonic = this.tectonicContractFactory.tectonicTToken({ address: TONIC_ADDRESS, network });
        const [stakedTonic, decimals] = await Promise.all([
          tonic.balanceOf('0xe165132fda537fa89ca1b52a647240c2b84c8f89'), // staking pool address
          tonic.decimals(),
        ]);
        return Number(stakedTonic) / 10 ** decimals;
      },
      resolvePricePerShare: ({ reserve, supply }) => reserve / supply,
    });
  }
}
