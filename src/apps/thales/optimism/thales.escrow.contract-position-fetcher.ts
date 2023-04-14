import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { ThalesEscrowContractPositionFetcher } from '../common/thales.escrow.contract-position-fetcher';

@PositionTemplate()
export class OptimismThalesEscrowContractPositionFetcher extends ThalesEscrowContractPositionFetcher {
  veTokenAddress = '0xa25816b9605009aa446d4d597f0aa46fd828f056';
}
