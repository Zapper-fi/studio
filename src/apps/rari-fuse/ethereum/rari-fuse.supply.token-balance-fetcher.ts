import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { CompoundSupplyTokenDataProps } from '~apps/compound/helper/compound.supply.token-helper';
import { PositionBalanceFetcher } from '~position/position-balance-fetcher.interface';
import { AppTokenPositionBalance } from '~position/position-balance.interface';
import { Network } from '~types/network.interface';

import { RariFuseContractFactory } from '../contracts';
import { RARI_FUSE_DEFINITION } from '../rari-fuse.definition';

@Register.TokenPositionBalanceFetcher({
  appId: RARI_FUSE_DEFINITION.id,
  groupId: RARI_FUSE_DEFINITION.groups.supply.id,
  network: Network.ETHEREUM_MAINNET,
})
export class EthereumRariFuseSupplyTokenBalanceFetcher implements PositionBalanceFetcher<AppTokenPositionBalance> {
  constructor(
    @Inject(APP_TOOLKIT)
    private readonly appToolkit: IAppToolkit,
    @Inject(RariFuseContractFactory)
    private readonly rariFuseContractFactory: RariFuseContractFactory,
  ) {}

  async getBalances(address: string) {
    const network = Network.ETHEREUM_MAINNET;
    const fuseLensAddress = '0x8da38681826f4abbe089643d2b3fe4c6e4730493';
    const fuseLens = this.rariFuseContractFactory.rariFusePoolLens({ address: fuseLensAddress, network });
    const poolsBySupplier = await fuseLens.getPoolsBySupplierWithData(address);
    const participatedComptrollers = poolsBySupplier[1].map(p => p.comptroller.toLowerCase());

    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances<CompoundSupplyTokenDataProps>({
      address,
      appId: RARI_FUSE_DEFINITION.id,
      groupId: RARI_FUSE_DEFINITION.groups.supply.id,
      network: Network.ETHEREUM_MAINNET,
      filter: v => participatedComptrollers.includes(v.dataProps.comptrollerAddress),
    });
  }
}
