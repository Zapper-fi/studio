import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { SynthetixSingleStakingFarmContractPositionBalanceHelper } from '~apps/synthetix';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { MstableContractFactory, MstableStaking, MstableStakingV2, MstableVmta } from '../contracts';
import { MSTABLE_DEFINITION } from '../mstable.definition';

const appId = MSTABLE_DEFINITION.id;
const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(appId, network)
export class EthereumMstableBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(SynthetixSingleStakingFarmContractPositionBalanceHelper)
    private readonly synthetix: SynthetixSingleStakingFarmContractPositionBalanceHelper,
    @Inject(MstableContractFactory) private readonly contractFactory: MstableContractFactory,
  ) {}

  private getImUsdTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId,
      groupId: MSTABLE_DEFINITION.groups.imusd.id,
      network,
    });
  }

  private getEarnFarmBalances(address: string) {
    return this.synthetix.getBalances({
      appId,
      network,
      groupId: MSTABLE_DEFINITION.groups.earn.id,
      address,
    });
  }

  private getSavingsVaultBalances(address: string) {
    return this.appToolkit.helpers.singleStakingContractPositionBalanceHelper.getBalances<MstableStaking>({
      appId,
      groupId: MSTABLE_DEFINITION.groups.savingsVault.id,
      network,
      address,
      resolveContract: opts => this.contractFactory.mstableStaking(opts),
      resolveStakedTokenBalance: ({ multicall, contract, address }) => multicall.wrap(contract).rawBalanceOf(address),
      resolveRewardTokenBalances: ({ multicall, contract, address }) => multicall.wrap(contract).earned(address),
    });
  }

  private getStakedBalancesMtaV1Farm(address: string) {
    return this.appToolkit.helpers.singleStakingContractPositionBalanceHelper.getBalances<MstableVmta>({
      appId,
      groupId: MSTABLE_DEFINITION.groups.mtaV1Farm.id,
      network,
      address,
      resolveContract: opts => this.contractFactory.mstableVmta(opts),
      resolveStakedTokenBalance: ({ multicall, contract, address }) =>
        multicall
          .wrap(contract)
          .locked(address)
          .then(v => v.amount)
          .catch(() => BigNumber.from('0')),
      resolveRewardTokenBalances: ({ multicall, contract, address }) => multicall.wrap(contract).earned(address),
    });
  }

  private getStakedBalancesMtaV2Farm(address: string) {
    return this.appToolkit.helpers.singleStakingContractPositionBalanceHelper.getBalances<MstableStakingV2>({
      appId,
      groupId: MSTABLE_DEFINITION.groups.mtaV2Farm.id,
      network,
      address,
      resolveContract: opts => this.contractFactory.mstableStakingV2(opts),
      resolveStakedTokenBalance: ({ multicall, contract, address }) =>
        multicall
          .wrap(contract)
          .rawBalanceOf(address)
          .then(v => v[0].add(v[1]))
          .catch(() => BigNumber.from('0')),
      resolveRewardTokenBalances: ({ multicall, contract, address }) => multicall.wrap(contract).earned(address),
    });
  }

  async getBalances(address: string) {
    const [imUsdTokenBalances, savingsVaultBalances, earnFarms, mtaV1Farms, mtaV2Farms] = await Promise.all([
      this.getImUsdTokenBalances(address),
      this.getSavingsVaultBalances(address),
      this.getEarnFarmBalances(address),
      this.getStakedBalancesMtaV1Farm(address),
      this.getStakedBalancesMtaV2Farm(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'imUSD',
        assets: imUsdTokenBalances,
        meta: [],
      },
      {
        label: 'Savings Vaults',
        assets: [...savingsVaultBalances],
        meta: [],
      },
      {
        label: 'MTA Staking V1',
        assets: [...mtaV1Farms],
        meta: [],
      },
      {
        label: 'MTA Staking V2',
        assets: [...mtaV2Farms],
        meta: [],
      },
      {
        label: 'Earn',
        assets: [...earnFarms],
        meta: [],
      },
    ]);
  }
}
