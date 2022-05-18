import { Network } from '~types/network.interface';
import { SOLACE_DEFINITION } from '../../solace.definition';

export default async function getScpBalance(address: string, appToolkit: any) {
  return appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
    address,
    appId: SOLACE_DEFINITION.id,
    groupId: SOLACE_DEFINITION.groups.scp.id,
    network: Network.ETHEREUM_MAINNET,
  });
}
