import { Inject } from '@nestjs/common';

import { SingleStakingContractPositionBalanceHelper, TokenBalanceHelper } from '~app-toolkit';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { isSupplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { GmxContractFactory, GmxRewardTracker } from '../contracts';
import { GMX_DEFINITION } from '../gmx.definition';

import { FARMS } from './gmx.farm.contract-position-fetcher';

const network = Network.AVALANCHE_MAINNET;

@Register.BalanceFetcher(GMX_DEFINITION.id, network)
export class AvalancheGmxBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(SingleStakingContractPositionBalanceHelper)
    private readonly singleStakingContractPositionBalanceHelper: SingleStakingContractPositionBalanceHelper,
    @Inject(GmxContractFactory) private readonly gmxContractFactory: GmxContractFactory,
    @Inject(TokenBalanceHelper) private readonly tokenBalanceHelper: TokenBalanceHelper,
  ) {}

  private async getGlpTokenBalances(address: string) {
    return this.tokenBalanceHelper.getTokenBalances({
      address,
      appId: GMX_DEFINITION.id,
      groupId: GMX_DEFINITION.groups.glp.id,
      network,
    });
  }

  private async getEsGmxTokenBalances(address: string) {
    return this.tokenBalanceHelper.getTokenBalances({
      address,
      appId: GMX_DEFINITION.id,
      groupId: GMX_DEFINITION.groups.esGmx.id,
      network,
    });
  }

  private async getStakedBalances(address: string) {
    return this.singleStakingContractPositionBalanceHelper.getBalances<GmxRewardTracker>({
      address,
      appId: GMX_DEFINITION.id,
      groupId: GMX_DEFINITION.groups.farm.id,
      network,
      resolveContract: ({ address, network }) => this.gmxContractFactory.gmxRewardTracker({ address, network }),
      resolveStakedTokenBalance: async ({ contractPosition, address, multicall, network }) => {
        const stakedToken = contractPosition.tokens.find(isSupplied)!;
        const readerAddress = '0x956d63dd6540230487eb7e599ef8b0c6fdca4ab8';
        const readerContract = this.gmxContractFactory.gmxRewardReader({ address: readerAddress, network });

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

        const readerAddress = '0x956d63dd6540230487eb7e599ef8b0c6fdca4ab8';
        const readerContract = this.gmxContractFactory.gmxRewardReader({ address: readerAddress, network });
        const stakingInfo = await multicall.wrap(readerContract).getStakingInfo(address, rewardTrackers);
        return [stakingInfo[0].toString(), stakingInfo[5].toString()];
      },
    });
  }

  async getBalances(address: string) {
    const [glpTokenBalances, esGmxTokenBalances, stakedBalances] = await Promise.all([
      this.getGlpTokenBalances(address),
      this.getEsGmxTokenBalances(address),
      this.getStakedBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'GLP',
        assets: [...glpTokenBalances],
      },
      {
        label: 'esGMX',
        assets: [...esGmxTokenBalances],
      },
      {
        label: 'Farms',
        assets: [...stakedBalances],
      },
    ]);
  }
}
