import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { SolacePoliciesContractPositionFetcher } from '../common/solace.policies.contract-position-fetcher';

@PositionTemplate()
export class EthereumSolacePoliciesContractPositionFetcher extends SolacePoliciesContractPositionFetcher {
  groupLabel = 'Policies';
  solaceCoverAddress = '0x501aceb72d62c9875825b71d9f78a27780b5624d';
  daiAddress = '0x6b175474e89094c44da98b954eedeac495271d0f';
  solaceCoverPointAddress = '0x501ace72166956f57b44dbbcc531a8e741449997';
}
