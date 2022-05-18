import { Network } from '~types/network.interface';
import { SOLACE_DEFINITION } from '../../solace.definition';

export default async function getXSolaceV1Balance(address: string, appToolkit: any) {
  return appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
    address,
    appId: SOLACE_DEFINITION.id,
    groupId: SOLACE_DEFINITION.groups.xsolacev1.id,
    network: Network.ETHEREUM_MAINNET,
  });
}
