import { Inject } from '@nestjs/common';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types';

import { PenguinChef, PenguinChefV2, PenguinContractFactory, PenguinExtraRewarder } from '../contracts';
import { PENGUIN_DEFINITION } from '../penguin.definition';

@Register.BalanceFetcher(PENGUIN_DEFINITION.id, Network.AVALANCHE_MAINNET)
export class AvalanchePenguinBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT)
    private readonly appToolkit: IAppToolkit,
    @Inject(PenguinContractFactory)
    private readonly contractFactory: PenguinContractFactory,
  ) {}

  private async getIPefiTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: PENGUIN_DEFINITION.id,
      groupId: PENGUIN_DEFINITION.groups.iPefi.id,
      network: Network.AVALANCHE_MAINNET,
    });
  }

  private async getXPefiTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: PENGUIN_DEFINITION.id,
      groupId: PENGUIN_DEFINITION.groups.xPefi.id,
      network: Network.AVALANCHE_MAINNET,
    });
  }

  private async getVaultTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: PENGUIN_DEFINITION.id,
      groupId: PENGUIN_DEFINITION.groups.vault.id,
      network: Network.AVALANCHE_MAINNET,
    });
  }

  private async getClaimableXPefiTokenBalances(address: string) {
    return this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
      address,
      appId: PENGUIN_DEFINITION.id,
      groupId: PENGUIN_DEFINITION.groups.vaultClaimable.id,
      network: Network.AVALANCHE_MAINNET,
      resolveBalances: async ({ address, contractPosition, multicall }) => {
        const contract = this.contractFactory.penguinVault(contractPosition);
        const balanceRaw = await multicall
          .wrap(contract)
          .pendingXPefi(address)
          .catch(() => 0);
        return [drillBalance(contractPosition.tokens[0], balanceRaw.toString())];
      },
    });
  }

  private async getChefV1FarmBalances(address: string) {
    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<PenguinChef>({
      address,
      appId: PENGUIN_DEFINITION.id,
      groupId: PENGUIN_DEFINITION.groups.chefV1Farm.id,
      network: Network.AVALANCHE_MAINNET,
      resolveChefContract: ({ network, contractAddress }) =>
        this.contractFactory.penguinChef({ network, address: contractAddress }),
      resolveStakedTokenBalance: this.appToolkit.helpers.masterChefDefaultStakedBalanceStrategy.build({
        resolveStakedBalance: ({ contract, multicall, contractPosition }) =>
          multicall
            .wrap(contract)
            .userInfo(contractPosition.dataProps.poolIndex, address)
            .then(v => v.amount),
      }),
      resolveClaimableTokenBalances: this.appToolkit.helpers.masterChefDefaultClaimableBalanceStrategy.build({
        resolveClaimableBalance: ({ multicall, contract, contractPosition, address }) =>
          multicall.wrap(contract).pendingPEFI(contractPosition.dataProps.poolIndex, address),
      }),
    });
  }

  private async getChefV2FarmBalances(address: string) {
    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<PenguinChefV2>({
      address,
      appId: PENGUIN_DEFINITION.id,
      groupId: PENGUIN_DEFINITION.groups.chefV2Farm.id,
      network: Network.AVALANCHE_MAINNET,
      resolveChefContract: ({ contractAddress, network }) =>
        this.contractFactory.penguinChefV2({ network, address: contractAddress }),
      resolveStakedTokenBalance: this.appToolkit.helpers.masterChefDefaultStakedBalanceStrategy.build({
        resolveStakedBalance: ({ contract, multicall, contractPosition }) =>
          multicall
            .wrap(contract)
            .userInfo(contractPosition.dataProps.poolIndex, address)
            .then(v => v.amount),
      }),
      resolveClaimableTokenBalances: this.appToolkit.helpers.masterChefV2ClaimableBalanceStrategy.build<
        PenguinChefV2,
        PenguinExtraRewarder
      >({
        resolvePrimaryClaimableBalance: ({ multicall, contract, contractPosition, address }) =>
          multicall.wrap(contract).pendingPEFI(contractPosition.dataProps.poolIndex, address),
        resolveRewarderAddress: ({ contract, contractPosition, multicall }) =>
          multicall
            .wrap(contract)
            .poolInfo(contractPosition.dataProps.poolIndex)
            .then(v => v.strategy),
        resolveRewarderContract: ({ network, rewarderAddress }) =>
          this.contractFactory.penguinExtraRewarder({ address: rewarderAddress, network }),
        resolveSecondaryClaimableBalance: ({ multicall, rewarderContract, contractPosition, address }) =>
          multicall
            .wrap(rewarderContract)
            .pendingTokens(contractPosition.dataProps.poolIndex, address, 0)
            .then(v => v[1][0]),
      }),
    });
  }

  async getBalances(address: string) {
    const [
      iPefiTokenBalances,
      xPefiTokenBalances,
      vaultTokenBalances,
      claimableXPefiBalances,
      chefV1FarmBalances,
      chefV2FarmBalances,
    ] = await Promise.all([
      this.getIPefiTokenBalances(address),
      this.getXPefiTokenBalances(address),
      this.getVaultTokenBalances(address),
      this.getClaimableXPefiTokenBalances(address),
      this.getChefV1FarmBalances(address),
      this.getChefV2FarmBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'iPEFI',
        assets: [...iPefiTokenBalances],
      },
      {
        label: 'xPEFI',
        assets: [...xPefiTokenBalances],
      },
      {
        label: 'Compounder Vaults',
        assets: [...vaultTokenBalances],
      },
      {
        label: 'Compounder Claimable xPEFI',
        assets: [...claimableXPefiBalances],
      },
      {
        label: 'Farms',
        assets: [...chefV1FarmBalances, ...chefV2FarmBalances],
      },
    ]);
  }
}
