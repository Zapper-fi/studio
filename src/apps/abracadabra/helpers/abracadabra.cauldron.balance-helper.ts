import { Inject, Injectable } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { compact, sumBy } from 'lodash';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { MetaType } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { ABRACADABRA_DEFINITION } from '../abracadabra.definition';
import { AbracadabraContractFactory } from '../contracts';

type AbracadabraCauldronBalancesParams = {
  address: string;
  network: Network;
};

@Injectable()
export class AbracadabraCauldronBalanceHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(AbracadabraContractFactory) private readonly contractFactory: AbracadabraContractFactory,
  ) {}

  async getBalances({ address, network }: AbracadabraCauldronBalancesParams) {
    const contractPositions = await this.appToolkit.getAppContractPositions({
      appId: ABRACADABRA_DEFINITION.id,
      groupIds: [ABRACADABRA_DEFINITION.groups.cauldron.id],
      network,
    });

    const contractFactory = this.contractFactory;
    const multicall = this.appToolkit.getMulticall(network);

    const balances = await Promise.all(
      contractPositions.map(async contractPosition => {
        const lendingPairContract = contractFactory.abracadabraCouldronTokenContract({
          network,
          address: contractPosition.address,
        });
        const suppliedToken = contractPosition.tokens.find(v => v.metaType === MetaType.SUPPLIED);
        const borrowedToken = contractPosition.tokens.find(v => v.metaType === MetaType.BORROWED);

        if (!suppliedToken || !borrowedToken) return null;

        const [borrowPartRaw, totalBorrowRaw, collateralShareRaw, bentoBoxAddressRaw] = await Promise.all([
          multicall.wrap(lendingPairContract).userBorrowPart(address),
          multicall.wrap(lendingPairContract).totalBorrow(),
          multicall.wrap(lendingPairContract).userCollateralShare(address),
          multicall.wrap(lendingPairContract).bentoBox(),
        ]);

        const bentoBoxTokenContract = contractFactory.abracadabraBentoBoxTokenContract({
          network,
          address: bentoBoxAddressRaw,
        });
        const totalBorrowElastic = new BigNumber(totalBorrowRaw.elastic.toString());
        const totalBorrowBase = new BigNumber(totalBorrowRaw.base.toString());
        const multiplier = totalBorrowElastic.div(totalBorrowBase);

        const borrowedBalanceRaw = new BigNumber(borrowPartRaw.toString()).multipliedBy(multiplier);

        const suppliedBalanceRaw = await bentoBoxTokenContract.toAmount(
          suppliedToken.address,
          collateralShareRaw,
          false,
        );

        const tokens = [
          drillBalance(suppliedToken, suppliedBalanceRaw.toString()),
          drillBalance(borrowedToken, borrowedBalanceRaw.toString(), { isDebt: true }),
        ];
        const balanceUSD = sumBy(tokens, t => t.balanceUSD);

        return {
          ...contractPosition,
          balanceUSD,
          tokens,
        };
      }),
    );

    return compact(balances);
  }
}
