import { Inject } from '@nestjs/common';

import { TokenBalanceHelper } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { CurveVotingEscrowContractPositionBalanceHelper } from '~apps/curve';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import {
  PickleContractFactory,
  PickleJarMasterchef,
  PickleJarSingleRewardStaking,
  PickleVotingEscrow,
  PickleVotingEscrowReward,
} from '../contracts';
import { PICKLE_DEFINITION } from '../pickle.definition';

@Register.BalanceFetcher(PICKLE_DEFINITION.id, Network.ETHEREUM_MAINNET)
export class EthereumPickleBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(TokenBalanceHelper) private readonly tokenBalanceHelper: TokenBalanceHelper,
    @Inject(PickleContractFactory) private readonly pickleContractFactory: PickleContractFactory,
    @Inject(CurveVotingEscrowContractPositionBalanceHelper)
    private readonly curveVotingEscrowContractPositionBalanceHelper: CurveVotingEscrowContractPositionBalanceHelper,
    @Inject(PickleContractFactory) private readonly contractFactory: PickleContractFactory,
  ) {}

  private async getJarBalances(address: string) {
    return await this.tokenBalanceHelper.getTokenBalances({
      network: Network.ETHEREUM_MAINNET,
      appId: PICKLE_DEFINITION.id,
      groupId: PICKLE_DEFINITION.groups.jar.id,
      address,
    });
  }

  private async getVotingEscrowBalances(address: string) {
    return this.curveVotingEscrowContractPositionBalanceHelper.getBalances<
      PickleVotingEscrow,
      PickleVotingEscrowReward
    >({
      address,
      appId: PICKLE_DEFINITION.id,
      groupId: PICKLE_DEFINITION.groups.votingEscrow.id,
      network: Network.ETHEREUM_MAINNET,
      resolveContract: ({ address, network }) => this.pickleContractFactory.pickleVotingEscrow({ network, address }),
      resolveRewardContract: ({ address, network }) =>
        this.pickleContractFactory.pickleVotingEscrowReward({ network, address }),
      resolveLockedTokenBalance: ({ contract, multicall }) =>
        multicall
          .wrap(contract)
          .locked(address)
          .then(v => v.amount),
      resolveRewardTokenBalance: ({ contract }) => contract.callStatic['claim()']({ from: address }),
    });
  }

  private async getFarmBalances(address: string) {
    const network = Network.ETHEREUM_MAINNET;

    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<PickleJarMasterchef>({
      address,
      appId: PICKLE_DEFINITION.id,
      groupId: PICKLE_DEFINITION.groups.masterchefFarm.id,
      network,
      resolveChefContract: () =>
        this.contractFactory.pickleJarMasterchef({
          network,
          address: '0xbd17b1ce622d73bd438b9e658aca5996dc394b0d',
        }),
      resolveStakedTokenBalance: this.appToolkit.helpers.masterChefDefaultStakedBalanceStrategy.build({
        resolveStakedBalance: ({ contract, multicall, contractPosition }) =>
          multicall
            .wrap(contract)
            .userInfo(contractPosition.dataProps.poolIndex, address)
            .then(v => v.amount),
      }),
      resolveClaimableTokenBalances: this.appToolkit.helpers.masterChefDefaultClaimableBalanceStrategy.build({
        resolveClaimableBalance: ({ multicall, contract, contractPosition, address }) =>
          multicall.wrap(contract).pendingPickle(contractPosition.dataProps.poolIndex, address),
      }),
    });
  }

  private async getSingleStakingBalances(address: string) {
    const network = Network.ETHEREUM_MAINNET;
    return this.appToolkit.helpers.singleStakingContractPositionBalanceHelper.getBalances<PickleJarSingleRewardStaking>(
      {
        address,
        appId: PICKLE_DEFINITION.id,
        groupId: PICKLE_DEFINITION.groups.singleStakingFarm.id,
        network,
        resolveContract: ({ address, network }) =>
          this.pickleContractFactory.pickleJarSingleRewardStaking({ address, network }),
        resolveStakedTokenBalance: ({ contract, address, multicall }) => multicall.wrap(contract).balanceOf(address),
        resolveRewardTokenBalances: ({ contract, address, multicall }) => multicall.wrap(contract).earned(address),
      },
    );
  }

  async getBalances(address: string) {
    const [farmBalances, jarBalances, singleStakingBalances, votingEscrowBalances] = await Promise.all([
      this.getFarmBalances(address),
      this.getJarBalances(address),
      this.getSingleStakingBalances(address),
      this.getVotingEscrowBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Jars',
        assets: jarBalances,
      },
      {
        label: 'Farms',
        assets: [...farmBalances, ...singleStakingBalances],
      },
      {
        label: 'Dill',
        assets: votingEscrowBalances,
      },
    ]);
  }
}
