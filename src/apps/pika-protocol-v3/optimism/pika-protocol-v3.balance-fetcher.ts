import { Inject } from '@nestjs/common';

import { drillBalance } from '~app-toolkit';
import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { IMulticallWrapper } from '~multicall';
import { isClaimable, isSupplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { PikaProtocolV3ContractFactory, PikaProtocolV3Vault } from '../contracts';
import { PIKA_PROTOCOL_V_3_DEFINITION } from '../pika-protocol-v3.definition';

const network = Network.OPTIMISM_MAINNET;

@Register.BalanceFetcher(PIKA_PROTOCOL_V_3_DEFINITION.id, network)
export class OptimismPikaProtocolV3BalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PikaProtocolV3ContractFactory) private readonly contractFactory: PikaProtocolV3ContractFactory,
  ) {}

  async getBalances(address: string) {
    const [vaultBalances] = await Promise.all([this.getFarmBalances(address)]);
    return presentBalanceFetcherResponse([{ label: 'Vaults', assets: vaultBalances }]);
  }

  private async getBalanceInVault(multicall: IMulticallWrapper, contract: PikaProtocolV3Vault, address: string) {
    const contractInst = await multicall.wrap(contract);
    const userShare = await contractInst.getShare(address);
    const vaultBalance = (await contractInst.getVault()).balance;
    const totalShare = await contractInst.getTotalShare();
    return (Number(userShare) * Number(vaultBalance)) / Number(totalShare);
  }

  async getFarmBalances(address: string) {
    return this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
      address,
      appId: PIKA_PROTOCOL_V_3_DEFINITION.id,
      groupId: PIKA_PROTOCOL_V_3_DEFINITION.groups.vault.id,
      network,

      resolveBalances: async ({ address, contractPosition, multicall }) => {
        const rewardsContract = this.contractFactory.pikaProtocolV3Rewards({
          address: '0x939c11c596b851447e5220584d37f12854ba02ae',
          network,
        });

        const contract = this.contractFactory.pikaProtocolV3Vault({
          address: contractPosition.address,
          network,
        });

        const stakedToken = contractPosition.tokens.find(isSupplied)!;
        const rewardToken = contractPosition.tokens.find(isClaimable)!;

        const [stakedBalanceRaw, rewardBalanceRaw] = await Promise.all([
          this.getBalanceInVault(multicall, contract, address),
          multicall.wrap(rewardsContract).getClaimableReward(address),
        ]);

        return [
          drillBalance(stakedToken, (Number(stakedBalanceRaw) / 100).toString()),
          drillBalance(rewardToken, rewardBalanceRaw.toString()),
        ];
      },
    });
  }
}
