import { ethers } from 'ethers';
import { range } from 'lodash';

import { drillBalance } from '~app-toolkit';
import { IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { MetaType } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { SolaceContractFactory } from '../../contracts';
import { SOLACE_DEFINITION } from '../../solace.definition';

const BN = ethers.BigNumber;

export default async function getBondBalance(
  address: string,
  appToolkit: IAppToolkit,
  solaceContractFactory: SolaceContractFactory,
) {
  const network = Network.ETHEREUM_MAINNET;
  return appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
    address,
    appId: SOLACE_DEFINITION.id,
    groupId: SOLACE_DEFINITION.groups.bonds.id,
    network,
    resolveBalances: async ({ address, contractPosition, multicall }) => {
      // Resolve the staked token and reward token from the contract position object
      const stakedToken = contractPosition.tokens.find(t => t.metaType === MetaType.SUPPLIED)!;
      const rewardToken = contractPosition.tokens.find(t => t.metaType === MetaType.CLAIMABLE)!;
      const teller = solaceContractFactory.bondTellerErc20({ address: contractPosition.address, network });

      const mct = multicall.wrap(teller);
      const balance = await mct.balanceOf(address);
      const indices = range(0, balance.toNumber());
      const tokenIDs = await Promise.all(indices.map((i: number) => mct.tokenOfOwnerByIndex(address, i)));
      const bonds = await Promise.all(tokenIDs.map(id => mct.bonds(id)));

      let supplySum = BN.from(0);
      let rewardSum = BN.from(0);
      indices.forEach((i: number) => {
        supplySum = supplySum.add(bonds[i].principalPaid);
        rewardSum = rewardSum.add(bonds[i].payoutAmount.sub(bonds[i].payoutAlreadyClaimed));
      });

      return [drillBalance(stakedToken, supplySum.toString()), drillBalance(rewardToken, rewardSum.toString())];
    },
  });
}
