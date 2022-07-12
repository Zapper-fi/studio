import { Inject } from '@nestjs/common';
import { gql } from 'graphql-request';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { CacheOnInterval } from '~cache/cache-on-interval.decorator';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { SynthetixMintrContractPositionHelper } from '../helpers/synthetix.mintr.contract-position-helper';
import { SYNTHETIX_DEFINITION } from '../synthetix.definition';

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

const appId = SYNTHETIX_DEFINITION.id;
const groupId = SYNTHETIX_DEFINITION.groups.mintr.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network, options: { excludeFromTvl: true } })
export class EthereumSynthetixMintrContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(SynthetixMintrContractPositionHelper)
    private readonly synthetixMintrContractPositionHelper: SynthetixMintrContractPositionHelper,
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
  ) {}

  @CacheOnInterval({
    key: `studio:${SYNTHETIX_DEFINITION.id}:${Network.ETHEREUM_MAINNET}:snx-holders`,
    timeout: 15 * 60 * 1000,
  })
  private async cacheSynthetixHolders() {
    const endpoint = `https://api.thegraph.com/subgraphs/name/synthetixio-team/mainnet-main`;
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

  async getPositions() {
    const holders = await this.cacheSynthetixHolders();

    return this.synthetixMintrContractPositionHelper.getPositions({ holders, network });
  }
}
