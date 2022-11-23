import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';
import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { CurveVotingEscrowContractPositionBalanceHelper } from '~apps/curve/helpers/curve.voting-escrow.contract-position-balance-helper';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { MAHADAO_DEFINITION } from '../mahadao.definition';
import { MahadaoContractFactory, MahadoMahaxLocker } from '../contracts';

const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(MAHADAO_DEFINITION.id, network)
export class EthereumMahadaoBalanceFetcher implements BalanceFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(CurveVotingEscrowContractPositionBalanceHelper)
    private readonly curveVotingEscrowContractPositionBalanceHelper: CurveVotingEscrowContractPositionBalanceHelper,
    @Inject(MahadaoContractFactory) private readonly bluebitContractFactory: MahadaoContractFactory,) { }

  async getMAHALockedAmount(address: string) {
    return this.curveVotingEscrowContractPositionBalanceHelper.getBalances<MahadoMahaxLocker>({
      address,
      network,
      appId: MAHADAO_DEFINITION.id,
      groupId: MAHADAO_DEFINITION.groups.locker.id,
      resolveContract: ({ address }) => this.bluebitContractFactory.mahadoMahaxLocker({ network, address }),
      resolveLockedTokenBalance: async ({ contract, multicall }) => {
        const noOfNft = await multicall.wrap(contract).balanceOf(address)
        let totalAmount = BigNumber.from(0)
        for (let i = 0; i < noOfNft.toNumber(); i++) {
          const nftId = await multicall.wrap(contract).tokenOfOwnerByIndex(address, i)
          const nftAmount = await multicall.wrap(contract).locked(nftId.toNumber())
          totalAmount = totalAmount.add(nftAmount.amount)
        }
        return totalAmount
      }
    });
  }

  async getBalances(address: string) {
    const [mahaLockAmounts] = await Promise.all([
      this.getMAHALockedAmount(address),
    ]);

    return presentBalanceFetcherResponse([{
      label: "MAHA Lock",
      assets: mahaLockAmounts
    }]);
  }
}
