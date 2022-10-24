import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { Network } from '~types/network.interface';

import { KyberSwapElasticLiquidityContractPositionFetcher } from '../common/kyberswap-elastic.liquidity.contract-position-fetcher';
import { KYBERSWAP_ELASTIC_DEFINITION } from '../kyberswap-elastic.definition';

@PositionTemplate()
export class CronosKyberSwapElasticLiquidityContractPositionFetcher extends KyberSwapElasticLiquidityContractPositionFetcher {
  appId = KYBERSWAP_ELASTIC_DEFINITION.id;
  groupId = KYBERSWAP_ELASTIC_DEFINITION.groups.liquidity.id;
  network = Network.CRONOS_MAINNET;

  groupLabel = 'Pools';

  subgraphUrl = 'https://cronos-graph.kyberengineering.io/subgraphs/name/kybernetwork/kyberswap-elastic-cronos';
  positionManagerAddress = '0x2b1c7b41f6a8f2b2bc45c3233a5d5fb3cd6dc9a8';
  factoryAddress = '0x5f1dddbf348ac2fbe22a163e30f99f9ece3dd50a';
}
