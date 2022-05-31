import { Inject } from '@nestjs/common';
import Axios from 'axios';
import { getAddress } from 'ethers/lib/utils';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { Cache } from '~cache/cache.decorator';
import { PositionBalanceFetcher } from '~position/position-balance-fetcher.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { Network } from '~types/network.interface';

import { OptimismContractFactory } from '../contracts';
import { OPTIMISM_DEFINITION } from '../optimism.definition';

export type OptimismAirdropData = {
  address: string;
  voterAmount: string;
  multisigSignerAmount: string;
  gitcoinAmount: string;
  activeBridgedAmount: string;
  opUserAmount: string;
  opRepeatUserAmount: string;
  bonusAmount: string;
  totalAmount: string;
};

export type OptimismProofData = {
  index: string;
};

const appId = OPTIMISM_DEFINITION.id;
const groupId = OPTIMISM_DEFINITION.groups.airdrop.id;
const network = Network.OPTIMISM_MAINNET;

@Register.ContractPositionBalanceFetcher({ appId, groupId, network })
export class OptimismOptimismAirdropContractPositionBalanceFetcher
  implements PositionBalanceFetcher<ContractPositionBalance>
{
  constructor(
    @Inject(APP_TOOLKIT)
    private readonly appToolkit: IAppToolkit,
    @Inject(OptimismContractFactory)
    private readonly optimismContractFactory: OptimismContractFactory,
  ) {}

  @Cache({
    key: (address: string) => `studio:${network}:${appId}:${groupId}:${address}`,
    ttl: 15 * 60,
  })
  private async getCachedAirdropData(address: string) {
    const [{ data: airdropData }, { data: proofData }] = await Promise.all([
      Axios.get<OptimismAirdropData>(`https://mainnet-indexer.optimism.io/v1/airdrops/${getAddress(address)}`),
      Axios.get<OptimismProofData>(`https://gateway-backend-mainnet.optimism.io/proof/${getAddress(address)}`),
    ]);

    return { balanceRaw: airdropData.totalAmount ?? '0', index: proofData.index };
  }

  async getBalances(address: string) {
    return this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
      address,
      appId: OPTIMISM_DEFINITION.id,
      groupId: OPTIMISM_DEFINITION.groups.airdrop.id,
      network: Network.OPTIMISM_MAINNET,
      resolveBalances: async ({ contractPosition, address }) => {
        const { balanceRaw, index } = await this.getCachedAirdropData(address);
        const contract = this.optimismContractFactory.optimismMerkleDistributor(contractPosition);
        const isClaimed = await contract.isClaimed(index);
        if (Number(balanceRaw) === 0 || isClaimed) return [drillBalance(contractPosition.tokens[0], '0')];
        return [drillBalance(contractPosition.tokens[0], balanceRaw)];
      },
    });
  }
}
