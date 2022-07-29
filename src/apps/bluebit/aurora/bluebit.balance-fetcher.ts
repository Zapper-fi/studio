import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { CurveVotingEscrowContractPositionBalanceHelper } from '~apps/curve/helpers/curve.voting-escrow.contract-position-balance-helper';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { BLUEBIT_DEFINITION } from '../bluebit.definition';
import { Bluebit, BluebitContractFactory, BluebitVeToken } from '../contracts';

const appId = BLUEBIT_DEFINITION.id;
const network = Network.AURORA_MAINNET;
const zero = BigNumber.from(0);

@Register.BalanceFetcher(BLUEBIT_DEFINITION.id, network)
export class AuroraBluebitBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(CurveVotingEscrowContractPositionBalanceHelper)
    private readonly curveVotingEscrowContractPositionBalanceHelper: CurveVotingEscrowContractPositionBalanceHelper,
    @Inject(BluebitContractFactory) private readonly bluebitContractFactory: BluebitContractFactory,
  ) {}

  async getVotingEscrowBalances(address: string) {
    return this.curveVotingEscrowContractPositionBalanceHelper.getBalances<BluebitVeToken>({
      address,
      network,
      appId: BLUEBIT_DEFINITION.id,
      groupId: BLUEBIT_DEFINITION.groups.votingEscrow.id,
      resolveContract: ({ address }) => this.bluebitContractFactory.bluebitVeToken({ network, address }),
      resolveLockedTokenBalance: ({ contract, multicall }) =>
        multicall
          .wrap(contract)
          .lockedOf(address)
          .then(v => v.amount),
    });
  }

  async getFarmBalances(address: string) {
    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<Bluebit>({
      address,
      appId,
      groupId: BLUEBIT_DEFINITION.groups.farm.id,
      network,
      resolveChefContract: () =>
        this.bluebitContractFactory.bluebit({
          network,
          address: '0x947dd92990343ae1d6cbe2102ea84ef73bc5790e',
        }),
      resolveStakedTokenBalance: this.appToolkit.helpers.masterChefDefaultStakedBalanceStrategy.build({
        resolveStakedBalance: async ({ contract, multicall, contractPosition }) => {
          const [user, pool] = await Promise.all([
            multicall.wrap(contract).users(contractPosition.dataProps.poolIndex, address),
            multicall.wrap(contract).pools(contractPosition.dataProps.poolIndex),
          ]);
          if (user.shares.eq(zero) || pool.shares.eq(zero)) return zero;
          const vault = this.bluebitContractFactory.vault({ address: pool.vault, network: network });
          return user.shares.mul(await vault.totalSupply()).div(pool.shares);
        },
      }),
      resolveClaimableTokenBalances: this.appToolkit.helpers.masterChefDefaultClaimableBalanceStrategy.build({
        resolveClaimableBalance: ({ multicall, contract, contractPosition, address }) =>
          multicall.wrap(contract).pendingRewards(contractPosition.dataProps.poolIndex, address),
      }),
    });
  }

  async getBalances(address: string) {
    const [votingEscrowBalances, farmBalances] = await Promise.all([
      this.getVotingEscrowBalances(address),
      this.getFarmBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Voting Escrow',
        assets: votingEscrowBalances,
      },
      {
        label: 'Farms',
        assets: farmBalances,
      },
    ]);
  }
}
