import { Inject } from '@nestjs/common';
import BigNumber from 'bignumber.js';

import { drillBalance } from '~app-toolkit';
import { Register } from '~app-toolkit/decorators';
import { ContractPositionBalanceHelper } from '~app-toolkit/helpers/balance/contract-position-balance.helper';
import { SingleStakingContractPositionBalanceHelper } from '~app-toolkit/helpers/balance/single-staking-farm.contract-position-balance-helper';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { LooksRareContractFactory, LooksRareFeeSharing } from '../contracts';
import { LOOKS_RARE_DEFINITION } from '../looks-rare.definition';

@Register.BalanceFetcher(LOOKS_RARE_DEFINITION.id, Network.ETHEREUM_MAINNET)
export class EthereumLooksRareBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(SingleStakingContractPositionBalanceHelper)
    private readonly singleStakingContractPositionBalanceHelper: SingleStakingContractPositionBalanceHelper,
    @Inject(ContractPositionBalanceHelper)
    private readonly contractPositionBalanceHelper: ContractPositionBalanceHelper,
    @Inject(LooksRareContractFactory)
    private readonly looksRareContractFactory: LooksRareContractFactory,
  ) {}

  private async getStakedBalances(address: string) {
    return this.singleStakingContractPositionBalanceHelper.getBalances<LooksRareFeeSharing>({
      address,
      appId: LOOKS_RARE_DEFINITION.id,
      groupId: LOOKS_RARE_DEFINITION.groups.farm.id,
      network: Network.ETHEREUM_MAINNET,
      resolveContract: ({ address, network }) =>
        this.looksRareContractFactory.looksRareFeeSharing({ address, network }),
      resolveStakedTokenBalance: ({ contract, address, multicall }) =>
        multicall.wrap(contract).calculateSharesValueInLOOKS(address),
      resolveRewardTokenBalances: ({ contract, address, multicall }) =>
        multicall.wrap(contract).calculatePendingRewards(address),
    });
  }

  private async getCompounderBalances(address: string) {
    return this.contractPositionBalanceHelper.getContractPositionBalances({
      address,
      appId: LOOKS_RARE_DEFINITION.id,
      groupId: LOOKS_RARE_DEFINITION.groups.compounder.id,
      network: Network.ETHEREUM_MAINNET,
      resolveBalances: async ({ address, contractPosition, multicall }) => {
        const contract = this.looksRareContractFactory.looksRareCompounder(contractPosition);
        const [shareBalanceRaw, pricePerShareRaw] = await Promise.all([
          multicall.wrap(contract).userInfo(address),
          multicall.wrap(contract).calculateSharePriceInLOOKS(),
        ]);

        const pricePerShare = Number(pricePerShareRaw) / 10 ** 18;
        const balanceRaw = new BigNumber(shareBalanceRaw.toString()).times(pricePerShare).toFixed(0);
        return [drillBalance(contractPosition.tokens[0], balanceRaw.toString())];
      },
    });
  }

  async getBalances(address: string) {
    const [stakedBalances, compounderBalances] = await Promise.all([
      this.getStakedBalances(address),
      this.getCompounderBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Staking',
        assets: stakedBalances,
      },
      {
        label: 'Compounder',
        assets: compounderBalances,
      },
    ]);
  }
}
