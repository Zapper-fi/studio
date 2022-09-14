import { Inject } from '@nestjs/common';

import { SingleStakingContractPositionBalanceHelper, TokenBalanceHelper } from '~app-toolkit';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { isSupplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { MetavaultTradeContractFactory, RewardTracker } from '../contracts';
import { MetavaultTradeOptionBalanceHelper } from '../helpers/metavault-trade.option.balance-helper';
import { METAVAULT_TRADE_DEFINITION } from '../metavault-trade.definition';

import { FARMS } from './metavault-trade.farm.contract-position-fetcher';

const network = Network.POLYGON_MAINNET;

@Register.BalanceFetcher(METAVAULT_TRADE_DEFINITION.id, network)
export class PolygonMetavaultTradeBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(SingleStakingContractPositionBalanceHelper)
    private readonly singleStakingContractPositionBalanceHelper: SingleStakingContractPositionBalanceHelper,
    @Inject(MetavaultTradeContractFactory)
    private readonly metavaultTradeContractFactory: MetavaultTradeContractFactory,
    @Inject(TokenBalanceHelper) private readonly tokenBalanceHelper: TokenBalanceHelper,
    @Inject(MetavaultTradeOptionBalanceHelper)
    private readonly metavaultTradeOptionBalanceHelper: MetavaultTradeOptionBalanceHelper,
  ) {}

  private async getMvlpTokenBalances(address: string) {
    return this.tokenBalanceHelper.getTokenBalances({
      address,
      appId: METAVAULT_TRADE_DEFINITION.id,
      groupId: METAVAULT_TRADE_DEFINITION.groups.mvlp.id,
      network,
    });
  }

  private async getEsMvxTokenBalances(address: string) {
    return this.tokenBalanceHelper.getTokenBalances({
      address,
      appId: METAVAULT_TRADE_DEFINITION.id,
      groupId: METAVAULT_TRADE_DEFINITION.groups.esMvx.id,
      network,
    });
  }

  private async getStakedBalances(address: string) {
    return this.singleStakingContractPositionBalanceHelper.getBalances<RewardTracker>({
      address,
      appId: METAVAULT_TRADE_DEFINITION.id,
      groupId: METAVAULT_TRADE_DEFINITION.groups.farm.id,
      network,
      resolveContract: ({ address, network }) => this.metavaultTradeContractFactory.rewardTracker({ address, network }),
      resolveStakedTokenBalance: async ({ contractPosition, address, multicall, network }) => {
        const stakedToken = contractPosition.tokens.find(isSupplied)!;
        const readerAddress = '0x398cab94dea3b44861e7ad7efcd23a6a35d57c3a';
        const readerContract = this.metavaultTradeContractFactory.rewardReader({ address: readerAddress, network });

        const depositBalances = await multicall
          .wrap(readerContract)
          .getDepositBalances(address, [stakedToken.address], [contractPosition.address]);
        return depositBalances[0];
      },
      resolveRewardTokenBalances: async ({ contractPosition, address, multicall, network }) => {
        const stakedToken = contractPosition.tokens.find(isSupplied)!;

        const farmDefinition = FARMS.find(v => v.stakedTokenAddress === stakedToken.address);
        const rewardTrackers = farmDefinition?.rewardTrackerAddresses ?? [];
        if (!rewardTrackers.length) return [];

        const readerAddress = '0x398cab94dea3b44861e7ad7efcd23a6a35d57c3a';
        const readerContract = this.metavaultTradeContractFactory.rewardReader({ address: readerAddress, network });
        const stakingInfo = await multicall.wrap(readerContract).getStakingInfo(address, rewardTrackers);
        return [stakingInfo[0].toString(), stakingInfo[5].toString()];
      },
    });
  }

  private async getOptionBalances(address: string) {
    const vaultAddress = '0x32848e2d3aecfa7364595609fb050a301050a6b4';
    return this.metavaultTradeOptionBalanceHelper.getBalance({ address, network, vaultAddress });
  }

  async getBalances(address: string) {
    const [mvlpTokenBalances, esMvxTokenBalances, stakedBalances, optionBalances] = await Promise.all([
      this.getMvlpTokenBalances(address),
      this.getEsMvxTokenBalances(address),
      this.getStakedBalances(address),
      this.getOptionBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'MVLP',
        assets: [...mvlpTokenBalances],
      },
      {
        label: 'esMVX',
        assets: [...esMvxTokenBalances],
      },
      {
        label: 'Options',
        assets: [...optionBalances],
      },
      {
        label: 'Farms',
        assets: [...stakedBalances],
      },
    ]);
  }
}
