import { Inject, Injectable } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { Benis, BananoContractFactory } from '../contracts';

@Injectable()
export class BananoFarmBalanceFetcherHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(BananoContractFactory) private readonly bananoContractFactory: BananoContractFactory,
  ) {}

  async getFarmBalances(network: Network, appId: string, groupId: string, address: string) {
    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<Benis>({
      address,
      network,
      appId,
      groupId,
      resolveChefContract: ({ contractAddress }) =>
        this.bananoContractFactory.benis({ address: contractAddress, network }),
      resolveStakedTokenBalance: this.appToolkit.helpers.masterChefDefaultStakedBalanceStrategy.build({
        resolveStakedBalance: ({ contract, multicall, contractPosition }) =>
          multicall
            .wrap(contract)
            .userInfo(contractPosition.dataProps.poolIndex, address)
            .then(userInfo => userInfo.amount),
      }),
      resolveClaimableTokenBalances: this.appToolkit.helpers.masterChefDefaultClaimableBalanceStrategy.build({
        resolveClaimableBalance: ({ multicall, contract, contractPosition, address }) =>
          multicall.wrap(contract).pendingWBAN(contractPosition.dataProps.poolIndex, address),
      }),
    });
  }
}
