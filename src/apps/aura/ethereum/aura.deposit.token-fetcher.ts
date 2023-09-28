import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { AuraDepositTokenFetcher } from '../common/aura.deposit.token-fetcher';

@PositionTemplate()
export class EthereumAuraDepositTokenFetcher extends AuraDepositTokenFetcher {
  boosterAddresses = ['0x7818a1da7bd1e64c199029e86ba244a9798eee10', '0xa57b8d98dae62b26ec3bcc4a365338157060b234'];
}
