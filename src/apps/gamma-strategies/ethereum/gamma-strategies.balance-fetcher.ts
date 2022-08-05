import { Inject } from '@nestjs/common';
import { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { GammaStrategiesContractFactory } from '../contracts';
import { GAMMA_STRATEGIES_DEFINITION } from '../gamma-strategies.definition';

const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(GAMMA_STRATEGIES_DEFINITION.id, network)
export class EthereumGammaStrategiesBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(GammaStrategiesContractFactory) private readonly contractFactory: GammaStrategiesContractFactory,
  ) {}

  private async getUserVaultAddresses(address: string) {
    const multicall = this.appToolkit.getMulticall(network);
    const factoryAddress = '0xae03233307865623aaef76da9ade669b86e6f20a';
    const factoryContract = this.contractFactory.gammaStrategiesFactory({ address: factoryAddress, network });
    const numUserVaults = await factoryContract.vaultCount(address);
    const vaultAddresses = await Promise.all(
      range(0, Number(numUserVaults)).map(i => multicall.wrap(factoryContract).getUserVault(address, i)),
    );

    return vaultAddresses;
  }

  private async getPoolTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      network,
      appId: GAMMA_STRATEGIES_DEFINITION.id,
      groupId: GAMMA_STRATEGIES_DEFINITION.groups.pool.id,
    });
  }

  private async getXGammaTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      network,
      appId: GAMMA_STRATEGIES_DEFINITION.id,
      groupId: GAMMA_STRATEGIES_DEFINITION.groups.xGamma.id,
    });
  }

  private async getTGammaTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      network,
      appId: GAMMA_STRATEGIES_DEFINITION.id,
      groupId: GAMMA_STRATEGIES_DEFINITION.groups.tGamma.id,
    });
  }

  async getBalances(address: string) {
    const userVaultAddresses = await this.getUserVaultAddresses(address);
    const allAddresses = [address, ...userVaultAddresses];

    const [poolTokenBalances, xGammaTokenBalances, tGammaTokenBalances] = await Promise.all([
      Promise.all(allAddresses.map(v => this.getPoolTokenBalances(v))).then(v => v.flat()),
      Promise.all(allAddresses.map(v => this.getXGammaTokenBalances(v))).then(v => v.flat()),
      Promise.all(allAddresses.map(v => this.getTGammaTokenBalances(v))).then(v => v.flat()),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Pools',
        assets: poolTokenBalances,
      },
      {
        label: 'xGAMMA',
        assets: xGammaTokenBalances,
      },
      {
        label: 'tGAMMA',
        assets: tGammaTokenBalances,
      },
    ]);
  }
}
