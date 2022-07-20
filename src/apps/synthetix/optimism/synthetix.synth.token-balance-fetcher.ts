import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionBalanceFetcher } from '~position/position-balance-fetcher.interface';
import { AppTokenPositionBalance } from '~position/position-balance.interface';
import { Network } from '~types/network.interface';

import { SynthetixSynthTokenBalanceHelper } from '../helpers/synthetix.synth.token-balance-helper';
import { SYNTHETIX_DEFINITION } from '../synthetix.definition';

const appId = SYNTHETIX_DEFINITION.id;
const groupId = SYNTHETIX_DEFINITION.groups.synth.id;
const network = Network.OPTIMISM_MAINNET;

@Register.TokenPositionBalanceFetcher({ appId, groupId, network })
export class OptimismSynthetixSynthTokenBalanceFetcher implements PositionBalanceFetcher<AppTokenPositionBalance> {
  constructor(
    @Inject(SynthetixSynthTokenBalanceHelper)
    private readonly tokenBalanceHelper: SynthetixSynthTokenBalanceHelper,
  ) {}

  async getBalances(address: string) {
    return this.tokenBalanceHelper.getBalances({
      address,
      network,
      resolverAddress: '0x95a6a3f44a70172e7d50a9e28c85dfd712756b8c',
    });
  }
}
