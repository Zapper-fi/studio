import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { AuraDepositTokenFetcher } from '../common/aura.deposit.token-fetcher';

@PositionTemplate()
export class BaseAuraDepositTokenFetcher extends AuraDepositTokenFetcher {
  boosterAddresses = ['0x98ef32edd24e2c92525e59afc4475c1242a30184'];
}
