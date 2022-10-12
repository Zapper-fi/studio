import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { Network } from '~types/network.interface';

import { KyberElasticLiquidityContractPositionFetcher } from '../common/kyber-elastic.liquidity.contract-position-fetcher';
import { KYBER_ELASTIC_DEFINITION } from '../kyber-elastic.definition';

@PositionTemplate()
export class AvalancheKyberElasticLiquidityContractPositionFetcher extends KyberElasticLiquidityContractPositionFetcher {
  appId = KYBER_ELASTIC_DEFINITION.id;
  groupId = KYBER_ELASTIC_DEFINITION.groups.liquidity.id;
  network = Network.AVALANCHE_MAINNET;

  groupLabel = 'Pools';

  subgraphUrl = 'https://api.thegraph.com/subgraphs/name/kybernetwork/kyberswap-elastic-avalanche';
  positionManagerAddress = '0x2b1c7b41f6a8f2b2bc45c3233a5d5fb3cd6dc9a8';
  factoryAddress = '0x5f1dddbf348ac2fbe22a163e30f99f9ece3dd50a';
}
