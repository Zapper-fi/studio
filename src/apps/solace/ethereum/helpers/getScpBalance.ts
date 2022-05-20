import { Network } from '~types/network.interface';
import { SOLACE_DEFINITION } from '../../solace.definition';
import { IAppToolkit } from '~app-toolkit/app-toolkit.interface';

export default async function getScpBalance(address: string, appToolkit: IAppToolkit) {
  return appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
    address,
    appId: SOLACE_DEFINITION.id,
    groupId: SOLACE_DEFINITION.groups.scp.id,
    network: Network.ETHEREUM_MAINNET,
  });
}
