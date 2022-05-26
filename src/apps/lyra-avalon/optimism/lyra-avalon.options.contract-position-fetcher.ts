import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { LyraAvalonContractFactory } from '../contracts';
import { LYRA_AVALON_DEFINITION } from '../lyra-avalon.definition';

const appId = LYRA_AVALON_DEFINITION.id;
const groupId = LYRA_AVALON_DEFINITION.groups.options.id;
const network = Network.OPTIMISM_MAINNET;
const address = '0xF24eCF73Fd8E7FC9d8F94cd9DF4f03107704D309'.toLowerCase() // TODO: pull from LyraRegistry instead

@Register.ContractPositionFetcher({ appId, groupId, network })
export class OptimismLyraAvalonOptionsContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(LyraAvalonContractFactory) private readonly lyraAvalonContractFactory: LyraAvalonContractFactory,
  ) { }

  async getPositions() {
    // TODO: make use of OptionMarketPricer
    return [];
  }
}
