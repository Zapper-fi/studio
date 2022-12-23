import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { SolacePoliciesContractPositionFetcher } from '../common/solace.policies.contract-position-fetcher';

@PositionTemplate()
export class AuroraSolacePoliciesContractPositionFetcher extends SolacePoliciesContractPositionFetcher {
  groupLabel = 'Policies';
  solaceCoverAddress = '0x501aceb72d62c9875825b71d9f78a27780b5624d';
  daiAddress = '0xe3520349f477a5f6eb06107066048508498a291b';
  solaceCoverPointAddress = '0x501ace72166956f57b44dbbcc531a8e741449997';
}
