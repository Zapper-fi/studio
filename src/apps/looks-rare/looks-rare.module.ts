import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { SynthetixAppModule } from '~apps/synthetix';

import { LooksRareContractFactory } from './contracts';
import { EthereumLooksRareCompounderContractPositionFetcher } from './ethereum/looks-rare.compounder.contract-position-fetcher';
import { EthereumLooksRareFarmContractPositionFetcher } from './ethereum/looks-rare.farm.contract-position-fetcher';
import { LooksRareAppDefinition, LOOKS_RARE_DEFINITION } from './looks-rare.definition';

@Register.AppModule({
  appId: LOOKS_RARE_DEFINITION.id,
  imports: [SynthetixAppModule],
  providers: [
    LooksRareAppDefinition,
    LooksRareContractFactory,
    EthereumLooksRareFarmContractPositionFetcher,
    EthereumLooksRareCompounderContractPositionFetcher,
  ],
})
export class LooksRareAppModule extends AbstractApp() {}
