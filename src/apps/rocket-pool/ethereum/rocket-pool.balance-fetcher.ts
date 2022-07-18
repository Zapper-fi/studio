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

const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(ROCKET_POOL_DEFINITION.id, network)
export class EthereumRocketPoolBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(RocketPoolContractFactory) private readonly rocketPoolContractFactory: RocketPoolContractFactory,
  ) {}

  async getStakedBalances(address: string) {
    return this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
      address,
      appId: ROCKET_POOL_DEFINITION.id,
      groupId: ROCKET_POOL_DEFINITION.groups.staking.id,
      network: Network.ETHEREUM_MAINNET,
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
    const [stakedBalances, oracleDaoBondBalances] = await Promise.all([
      this.getStakedBalances(address),
      this.getOracleDaoBondBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Staking',
        assets: [...stakedBalances],
      },
      {
        label: 'Oracle DAO Bond',
        assets: [...oracleDaoBondBalances],
      },
    ]);
  }
}
