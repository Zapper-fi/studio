import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { Network } from '~types/network.interface';

import { KyberSwapElasticFarmContractPositionFetcher } from '../common/kyberswap-elastic.farm.contract-position-fetcher';
import { KYBERSWAP_ELASTIC_DEFINITION } from '../kyberswap-elastic.definition';

@PositionTemplate()
export class EthereumKyberswapElasticFarmContractPositionFetcher extends KyberSwapElasticFarmContractPositionFetcher {
  appId = KYBERSWAP_ELASTIC_DEFINITION.id;
  groupId = KYBERSWAP_ELASTIC_DEFINITION.groups.farm.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'Farms';
  chefAddress = '0xb85ebe2e4ea27526f817ff33fb55fb240057c03f';
}
