import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { LYRA_AVALON_DEFINITION } from '../lyra-avalon.definition';

const network = Network.OPTIMISM_MAINNET;
const contractAddress = '0x8A92e520BA9dFBa024De3bD7e0926bDcC4911fCC'.toLowerCase() // TODO: pull from LyraRegistry instead

@Register.BalanceFetcher(LYRA_AVALON_DEFINITION.id, network)
export class OptimismLyraAvalonBalanceFetcher implements BalanceFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) { }

  async getBalances(address: string) {
    return presentBalanceFetcherResponse([]);
  }
}
