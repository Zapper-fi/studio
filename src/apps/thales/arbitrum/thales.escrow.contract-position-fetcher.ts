import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { ThalesEscrowContractPositionFetcher } from '../common/thales.escrow.contract-position-fetcher';

@PositionTemplate()
export class ArbitrumThalesEscrowContractPositionFetcher extends ThalesEscrowContractPositionFetcher {
  veTokenAddress = '0x391a45f31c1837e3d837c23e05f42a098329d50d';
}
