import { Inject } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { sumBy } from 'lodash';

import { drillBalance } from '~app-toolkit';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { APP_TOOLKIT, IAppToolkit } from '~lib';
import { ContractType } from '~position/contract.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { claimable, locked } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { PieDaoContractFactory, PieDaoStaking } from '../contracts';
import { PIE_DAO_DEFINITION } from '../pie-dao.definition';

const appId = PIE_DAO_DEFINITION.id;
const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(appId, network)
export class EthereumPieDaoBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PieDaoContractFactory)
    private readonly contractFactory: PieDaoContractFactory,
  ) {}

  private async getSingleStakingBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      appId,
      network,
      address,
      groupId: PIE_DAO_DEFINITION.groups.farmSingleStaking.id,
    });
  }

  private async getMasterChefBalances(address: string) {
    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<PieDaoStaking>({
      address,
      appId,
      network,
      groupId: PIE_DAO_DEFINITION.groups.farmMasterChef.id,
      resolveChefContract: ({ contractAddress }) =>
        this.contractFactory.pieDaoStaking({ network, address: contractAddress }),
      resolveStakedTokenBalance: this.appToolkit.helpers.masterChefDefaultStakedBalanceStrategy.build({
        resolveStakedBalance: ({ contract, multicall, contractPosition }) =>
          multicall.wrap(contract).getStakeTotalDeposited(address, contractPosition.dataProps.poolIndex),
      }),
      resolveClaimableTokenBalances: this.appToolkit.helpers.masterChefDefaultClaimableBalanceStrategy.build({
        resolveClaimableBalance: ({ multicall, contract, contractPosition, address }) =>
          multicall.wrap(contract).getStakeTotalUnclaimed(address, contractPosition.dataProps.poolIndex),
      }),
    });
  }

  private async getVeDoughBalances(address: string) {
    const multicall = this.appToolkit.getMulticall(network);
    const prices = await this.appToolkit.getBaseTokenPrices(network);

    const doughToken = prices.find(p => p.symbol == 'DOUGH');
    if (!doughToken) return [];

    const contractAddress = '0x6bd0d8c8ad8d3f1f97810d5cc57e9296db73dc45';
    const contract = this.contractFactory.pieDaoVoteLockedDough({ network, address: contractAddress });

    const userData = await multicall.wrap(contract).getStakingData(address);
    const lockedRaw = userData.accountVeTokenBalance.toString();
    const claimableRaw = new BigNumber(userData.accountWithdrawableRewards.toString())
      .minus(userData.accountWithdrawnRewards.toString())
      .toFixed(0);
    const tokens = [
      drillBalance(locked(doughToken), lockedRaw),
      drillBalance(claimable(doughToken), claimableRaw),
    ].filter(v => v.balanceUSD > 0);
    const balanceUSD = sumBy(tokens, v => v.balanceUSD);

    const position: ContractPositionBalance = {
      type: ContractType.POSITION,
      address: contractAddress,
      appId,
      network,
      groupId: PIE_DAO_DEFINITION.groups.voting.id,
      dataProps: {},
      displayProps: {
        label: 'Vote Locked DOUGH',
        images: [getTokenImg(doughToken.address, network)],
      },
      tokens,
      balanceUSD,
    };

    return [position];
  }

  private async getEDoughTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      appId,
      network,
      address,
      groupId: PIE_DAO_DEFINITION.groups.eDough.id,
    });
  }

  async getBalances(address: string) {
    const [veDoughBalances, eDoughBalances, singleStakingBalances, masterChefBalances] = await Promise.all([
      this.getVeDoughBalances(address),
      this.getEDoughTokenBalances(address),
      this.getSingleStakingBalances(address),
      this.getMasterChefBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Farming',
        assets: [...singleStakingBalances, ...masterChefBalances],
      },
      {
        label: 'Escrow',
        assets: [...eDoughBalances],
      },
      {
        label: 'Voting Escrow',
        assets: [...veDoughBalances],
      },
    ]);
  }
}
