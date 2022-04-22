import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';
import _ from 'lodash';

import { drillBalance } from '~app-toolkit';
import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { ContractType } from '~position/contract.interface';
import { PositionBalance } from '~position/position-balance.interface';
import { claimable, vesting } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { OlympusContractFactory } from '../contracts';
import { OLYMPUS_DEFINITION } from '../olympus.definition';

const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(OLYMPUS_DEFINITION.id, network)
export class EthereumOlympusBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(OlympusContractFactory) private readonly olympusContractFactory: OlympusContractFactory,
  ) {}

  async getBalances(address: string) {
    const bondDepository = '0x9025046c6fb25Fb39e720d97a8FD881ED69a1Ef6';
    const gOHM = '0x0ab87046fBb341D058F17CBC4c1133F25a20a52f';
    const bondDepositoryContract = this.olympusContractFactory.bondDepository({ address: bondDepository, network });
    const gOHMContract = this.olympusContractFactory.gohmContract({ address: gOHM, network });
    const currentIndex = await gOHMContract.index();

    const ids = await bondDepositoryContract.indexesFor(address).then(ids => ids.map(id => id.toString()));
    const promises = await Promise.all(
      ids.map(async id => {
        const note = await bondDepositoryContract.notes(address, id);
        const matured = note.matured * 1000 < Date.now() ? true : false;
        return {
          matured,
          payout: note.payout, // Always denominated in gOHM,
        };
      }),
    );
    const prices = await this.appToolkit.getBaseTokenPrices(network);
    const gOHMToken = prices.find(p => p.symbol === 'OHM')!;

    const claimableBonds = promises.filter(p => p.matured);
    const vestingBonds = promises.filter(p => !p.matured);

    const claimableBondAmountOHM = claimableBonds.reduce((acc, bond) => acc.add(bond.payout), BigNumber.from(0));
    const vestingBondAmountOHM = vestingBonds.reduce((acc, bond) => acc.add(bond.payout), BigNumber.from(0));

    const claimableOHMBalance = drillBalance(
      claimable(gOHMToken),
      (Number(claimableBondAmountOHM.mul(currentIndex)) / 1e18).toString(),
    );
    const activeOHMBalance = drillBalance(
      vesting(gOHMToken),
      (Number(vestingBondAmountOHM.mul(currentIndex)) / 1e18).toString(),
    );

    const tokens = [claimableOHMBalance, activeOHMBalance];
    const contractPositionBalance: PositionBalance = {
      type: ContractType.POSITION,
      network,
      address: bondDepository,
      appId: OLYMPUS_DEFINITION.id,
      groupId: OLYMPUS_DEFINITION.groups.bonds.id,
      tokens: tokens,
      balanceUSD: _.sumBy(tokens, t => t.balanceUSD),
      dataProps: {},
      displayProps: {
        label: OLYMPUS_DEFINITION.id,
        images: tokens.map(t => getTokenImg(t.address, t.network)),
      },
    };

    return presentBalanceFetcherResponse([
      {
        label: 'Bonds',
        assets: [contractPositionBalance],
      },
    ]);
  }
}
