import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { drillBalance } from '~app-toolkit';
import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { getAppImg } from '~app-toolkit/helpers/presentation/image.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { ContractType } from '~position/contract.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { MetaType } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { IdleContractFactory } from '../contracts';
import { IDLE_DEFINITION } from '../idle.definition';

const appId = IDLE_DEFINITION.id;
const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(IDLE_DEFINITION.id, network)
export class EthereumIdleBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(IdleContractFactory) private readonly idleContractFactory: IdleContractFactory,
  ) {}

  private async getVaultBalances(address: string) {
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);

    const appTokens = await this.appToolkit.getAppTokenPositions({
      appId,
      groupIds: [IDLE_DEFINITION.groups.vault.id],
      network,
    });

    return await Promise.all(
      appTokens.map(async appToken => {
        const tokenContract = this.idleContractFactory.idleToken({ network, address: appToken.address });

        const [balanceRaw, rewardBalancesRaw] = await Promise.all([
          multicall.wrap(tokenContract).balanceOf(address),
          multicall.wrap(tokenContract).getGovTokensAmounts(address),
        ]);

        const vaultTokenBalance = {
          ...drillBalance(appToken, balanceRaw.toString()),
          metaType: MetaType.SUPPLIED,
        };

        const claimableTokenBalances = _.compact(
          await Promise.all(
            rewardBalancesRaw.map(async (rewardBalanceRaw, i) => {
              const rewardTokenAddressRaw = await multicall.wrap(tokenContract).govTokens(i);
              const rewardTokenAddress = rewardTokenAddressRaw.toLowerCase();
              const rewardToken = baseTokens.find(price => price.address === rewardTokenAddress);

              if (!rewardToken) return null;

              return { ...drillBalance(rewardToken, rewardBalanceRaw.toString()), metaType: MetaType.CLAIMABLE };
            }),
          ),
        );

        const tokens = [vaultTokenBalance, ...claimableTokenBalances];
        const balanceUSD = tokens
          .filter(v => v.metaType === MetaType.CLAIMABLE)
          .reduce((acc, v) => (acc += v.balanceUSD), 0);
        const position: ContractPositionBalance = {
          type: ContractType.POSITION,
          address: appToken.address,
          appId,
          groupId: IDLE_DEFINITION.groups.vault.id,
          network,
          tokens,
          dataProps: {},
          displayProps: {
            label: vaultTokenBalance.symbol,
            images: [getAppImg(IDLE_DEFINITION.id)],
          },
          balanceUSD,
        };

        return position;
      }),
    );
  }

  async getBalances(address: string) {
    const [vaultBalances] = await Promise.all([this.getVaultBalances(address)]);

    return presentBalanceFetcherResponse([
      {
        label: 'Vaults',
        assets: vaultBalances,
      },
    ]);
  }
}
