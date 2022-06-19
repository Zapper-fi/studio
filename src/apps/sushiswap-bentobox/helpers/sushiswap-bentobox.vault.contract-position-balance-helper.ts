import { Inject, Injectable } from '@nestjs/common';

import { ContractPositionBalanceHelper } from '~app-toolkit/helpers/balance/contract-position-balance.helper';
import { drillBalance } from '~app-toolkit/helpers/balance/token-balance.helper';
import { Network } from '~types/network.interface';

import { SushiswapBentoboxContractFactory } from '../contracts';
import { SUSHISWAP_BENTOBOX_DEFINITION } from '../sushiswap-bentobox.definition';

@Injectable()
export class SushiSwapBentoBoxContractPositionBalanceHelper {
  constructor(
    @Inject(SushiswapBentoboxContractFactory) private readonly contractFactory: SushiswapBentoboxContractFactory,
    @Inject(ContractPositionBalanceHelper)
    private readonly contractPositionBalanceHelper: ContractPositionBalanceHelper,
  ) {}

  getBalances({ address, bentoBoxAddress, network }: { address: string; network: Network; bentoBoxAddress: string }) {
    return this.contractPositionBalanceHelper.getContractPositionBalances({
      network,
      appId: SUSHISWAP_BENTOBOX_DEFINITION.id,
      groupId: SUSHISWAP_BENTOBOX_DEFINITION.groups.vault.id,
      address,
      resolveBalances: async ({ address, multicall, contractPosition }) => {
        const contract = this.contractFactory.sushiswapBentobox({ address: bentoBoxAddress, network });
        const [token] = contractPosition.tokens;
        const balance = await multicall.wrap(contract).balanceOf(token.address, address);
        return [drillBalance(token, balance.toString())];
      },
    });
  }
}
