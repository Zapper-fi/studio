import { Inject, Injectable } from '@nestjs/common';
import { gql } from 'graphql-request';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

type Holder = {
  id: string;
  collateral: string;
  transferable: string;
  initialDebtOwnership: string;
};

type HoldersResponse = {
  snxholders: Holder[];
};

const HOLDERS_QUERY = gql`
  query getHolders($lastId: String!) {
    snxholders(
      first: 1000
      skip: $skip
      orderBy: collateral
      orderDirection: desc
      where: { initialDebtOwnership_not: "0", id_gt: $lastId }
    ) {
      id
      collateral
      transferable
      initialDebtOwnership
    }
  }
`;

export type SynthetixMintrContractPositionBalanceHelperParams = {
  network: Network.ETHEREUM_MAINNET | Network.OPTIMISM_MAINNET;
};

@Injectable()
export class SynthetixHoldersHelper {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  private graphs = {
    [Network.ETHEREUM_MAINNET]: 'https://api.thegraph.com/subgraphs/name/synthetixio-team/mainnet-main',
    [Network.OPTIMISM_MAINNET]: 'https://api.thegraph.com/subgraphs/name/synthetixio-team/optimism-main',
  };

  async getCacheSynthetixHolders({ network }: SynthetixMintrContractPositionBalanceHelperParams) {
    const endpoint = this.graphs[network];
    const holders = new Map<string, Holder>();

    let lastResult: HoldersResponse;
    let lastId = '';

    do {
      lastResult = await this.appToolkit.helpers.theGraphHelper.request<HoldersResponse>({
        endpoint,
        query: HOLDERS_QUERY,
        variables: { lastId },
      });
      lastId = lastResult.snxholders[lastResult.snxholders.length - 1].id;
      lastResult.snxholders.forEach(v => holders.set(v.id, v));
    } while (lastResult.snxholders.length === 1000);

    return Array.from(holders.values());
  }
}
