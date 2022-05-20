import { drillBalance } from '~app-toolkit';
import { IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { MetaType } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { SolaceContractFactory } from '../../contracts';
import { SOLACE_DEFINITION } from '../../solace.definition';

export default async function getPolicyBalance(
  address: string,
  appToolkit: IAppToolkit,
  solaceContractFactory: SolaceContractFactory,
) {
  const network = Network.ETHEREUM_MAINNET;
  return appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
    address,
    appId: SOLACE_DEFINITION.id,
    groupId: SOLACE_DEFINITION.groups.policies.id,
    network,
    resolveBalances: async ({ address, contractPosition }) => {
      // Resolve the staked token and reward token from the contract position object
      const stakedToken = contractPosition.tokens.find(t => t.metaType === MetaType.SUPPLIED)!;

      const product = solaceContractFactory.solaceCoverProduct({ address: contractPosition.address, network });
      const bal = await product.accountBalanceOf(address);

      return [drillBalance(stakedToken, bal.toString())];
    },
  });
}
