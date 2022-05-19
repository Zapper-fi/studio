import { SolaceContractFactory } from '../../contracts';
import { Network } from '~types/network.interface';
import { SOLACE_DEFINITION } from '../../solace.definition';
import { drillBalance } from '~app-toolkit';

import { ethers } from 'ethers';
const BN = ethers.BigNumber;
import { range } from '~apps/solace/utils';

export default async function getBondBalance(address: string, appToolkit: any, solaceContractFactory: SolaceContractFactory) {
  const network = Network.ETHEREUM_MAINNET;
  return appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
      address,
      appId: SOLACE_DEFINITION.id,
      groupId: SOLACE_DEFINITION.groups.bonds.id,
      network,
      resolveBalances: async ({ address, contractPosition, multicall }) => {

        // Resolve the staked token and reward token from the contract position object
        const stakedToken = contractPosition.tokens.find((t:any) => t.metaType === 'supplied')!;
        const rewardToken = contractPosition.tokens.find((t:any) => t.metaType === 'claimable')!;

        const teller = solaceContractFactory.bondTellerErc20({ address: contractPosition.address, network });

        const mct = multicall.wrap(teller);

        const balance = await mct.balanceOf(address);
        const indices = range(0, balance.toNumber());
        const tokenIDs = await Promise.all(indices.map((i:any) => mct.tokenOfOwnerByIndex(address, i)));
        const bonds = await Promise.all(tokenIDs.map(id => mct.bonds(id)));

        let supplySum = BN.from(0);
        let rewardSum = BN.from(0);
        indices.forEach((i:any) => {
          supplySum = supplySum.add(bonds[i].principalPaid);
          rewardSum = rewardSum.add(bonds[i].payoutAmount.sub(bonds[i].payoutAlreadyClaimed));
        });

        return [
          drillBalance(stakedToken, supplySum.toString()),
          drillBalance(rewardToken, rewardSum.toString()),
        ];
      },
    });
}
