import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { SolacePoliciesContractPositionFetcher } from '../common/solace.policies.contract-position-fetcher';

@PositionTemplate()
export class FantomSolacePoliciesContractPositionFetcher extends SolacePoliciesContractPositionFetcher {
  groupLabel = 'Policies';
  solaceCoverAddress = '0x501aceb72d62c9875825b71d9f78a27780b5624d';
  daiAddress = '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e';
  solaceCoverPointAddress = '0x501ace72166956f57b44dbbcc531a8e741449997';
}
