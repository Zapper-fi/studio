import { Inject } from '@nestjs/common';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { CompoundContractFactory } from '~apps/compound';
import { CompoundBorrowContractPositionDataProps } from '~apps/compound/helper/compound.borrow.contract-position-helper';
import { PositionBalanceFetcher } from '~position/position-balance-fetcher.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { isBorrowed } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { RariFuseContractFactory } from '../contracts';
import { RARI_FUSE_DEFINITION } from '../rari-fuse.definition';

@Register.ContractPositionBalanceFetcher({
  appId: RARI_FUSE_DEFINITION.id,
  groupId: RARI_FUSE_DEFINITION.groups.borrow.id,
  network: Network.ETHEREUM_MAINNET,
})
export class EthereumRariFuseBorrowContractPositionBalanceFetcher
  implements PositionBalanceFetcher<ContractPositionBalance>
{
  constructor(
    @Inject(APP_TOOLKIT)
    private readonly appToolkit: IAppToolkit,
    @Inject(CompoundContractFactory)
    private readonly compoundContractFactory: CompoundContractFactory,
    @Inject(RariFuseContractFactory)
    private readonly rariFuseContractFactory: RariFuseContractFactory,
  ) {}

  async getBalances(address: string) {
    const network = Network.ETHEREUM_MAINNET;
    const fuseLensAddress = '0x8da38681826f4abbe089643d2b3fe4c6e4730493';
    const fuseLens = this.rariFuseContractFactory.rariFusePoolLens({ address: fuseLensAddress, network });
    const poolsBySupplier = await fuseLens.getPoolsBySupplier(address);
    const participatedComptrollers = poolsBySupplier[1].map(p => p.comptroller.toLowerCase());

    return this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances<CompoundBorrowContractPositionDataProps>(
      {
        address,
        appId: RARI_FUSE_DEFINITION.id,
        groupId: RARI_FUSE_DEFINITION.groups.borrow.id,
        network: Network.ETHEREUM_MAINNET,
        filter: v => participatedComptrollers.includes(v.dataProps.comptrollerAddress),
        resolveBalances: async ({ address, contractPosition, multicall }) => {
          const borrowedToken = contractPosition.tokens.find(isBorrowed)!;
          const contract = this.compoundContractFactory.compoundCToken(contractPosition);
          const balanceRaw = await multicall
            .wrap(contract)
            .borrowBalanceCurrent(address)
            .catch(() => '0');

          return [drillBalance(borrowedToken, balanceRaw.toString(), { isDebt: true })];
        },
      },
    );
  }
}
