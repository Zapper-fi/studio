import { Inject } from '@nestjs/common';

import { drillBalance } from '~app-toolkit';
import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { isSupplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { RocketPoolContractFactory } from '../contracts';
import { ROCKET_POOL_DEFINITION } from '../rocket-pool.definition';
import {
  rocketMinipoolManagerAddress,
  rocketNodeStakingAddress,
} from './rocket-pool.staking.contract-position-fetcher';

const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(ROCKET_POOL_DEFINITION.id, network)
export class EthereumRocketPoolBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(RocketPoolContractFactory) private readonly rocketPoolContractFactory: RocketPoolContractFactory,
  ) {}

  async getStakedEthBalance(address: string) {
    return this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
      address,
      appId: ROCKET_POOL_DEFINITION.id,
      groupId: ROCKET_POOL_DEFINITION.groups.staking.id,
      network: Network.ETHEREUM_MAINNET,
      filter: p => p.address == rocketMinipoolManagerAddress,
      resolveBalances: async ({ address, contractPosition }) => {
        const token = contractPosition.tokens.find(isSupplied)!;
        const contract = this.rocketPoolContractFactory.rocketMinipoolManager(contractPosition);
        const minipoolCount = (await contract.getNodeActiveMinipoolCount(address)).toNumber();
        const minipoolDepositSize = 16 * 10 ** 18; // 16 ETH
        const balanceRaw = minipoolCount * minipoolDepositSize;
        const tokenBalance = drillBalance(token, balanceRaw.toString());
        return [tokenBalance];
      },
    });
  }

  async getStakedRplBalance(address: string) {
    return this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
      address,
      appId: ROCKET_POOL_DEFINITION.id,
      groupId: ROCKET_POOL_DEFINITION.groups.staking.id,
      network: Network.ETHEREUM_MAINNET,
      filter: p => p.address == rocketNodeStakingAddress,
      resolveBalances: async ({ address, contractPosition }) => {
        const token = contractPosition.tokens.find(isSupplied)!;
        const contract = this.rocketPoolContractFactory.rocketNodeStaking(contractPosition);
        const balanceRaw = await contract.getNodeRPLStake(address);
        const tokenBalance = drillBalance(token, balanceRaw.toString());
        return [tokenBalance];
      },
    });
  }

  async getOracleDaoBondBalances(address: string) {
    return this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
      address,
      appId: ROCKET_POOL_DEFINITION.id,
      groupId: ROCKET_POOL_DEFINITION.groups.oracleDaoBond.id,
      network: Network.ETHEREUM_MAINNET,
      resolveBalances: async ({ address, contractPosition }) => {
        const token = contractPosition.tokens.find(isSupplied)!;
        const contract = this.rocketPoolContractFactory.rocketDaoNodeTrusted(contractPosition);
        const balanceRaw = await contract.getMemberRPLBondAmount(address);
        const tokenBalance = drillBalance(token, balanceRaw.toString());
        return [tokenBalance];
      },
    });
  }

  async getBalances(address: string) {
    const [miniPoolBalances, stakedRplBalances, oracleDaoBondBalances] = await Promise.all([
      this.getStakedEthBalance(address),
      this.getStakedRplBalance(address),
      this.getOracleDaoBondBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Minipools',
        assets: [...miniPoolBalances],
      },
      {
        label: 'Staking',
        assets: [...stakedRplBalances],
      },
      {
        label: 'Oracle DAO Bond',
        assets: [...oracleDaoBondBalances],
      },
    ]);
  }
}
