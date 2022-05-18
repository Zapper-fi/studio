import { SolaceContractFactory } from '../../contracts';
import { Network } from '~types/network.interface';
import { SOLACE_DEFINITION } from '../../solace.definition';
import { drillBalance } from '~app-toolkit';

export default async function getPolicyBalance(address: string, appToolkit: any, solaceContractFactory: SolaceContractFactory) {
  const network = Network.ETHEREUM_MAINNET;
  return appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
      address,
      appId: SOLACE_DEFINITION.id,
      groupId: SOLACE_DEFINITION.groups.policies.id,
      network,
      resolveBalances: async ({ address, contractPosition, multicall }) => {
        // Resolve the staked token and reward token from the contract position object
        const stakedToken = contractPosition.tokens.find((t:any) => t.metaType === 'supplied')!;

        const product = solaceContractFactory.solaceCoverProduct({ address: contractPosition.address, network });
        const bal = await product.accountBalanceOf(address);

        return [
          drillBalance(stakedToken, bal.toString()),
        ];
      },
    });
}
