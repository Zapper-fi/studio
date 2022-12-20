import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { GoldfinchContractFactory } from './contracts';
import { EthereumGoldfinchFiduTokenFetcher } from './ethereum/goldfinch.fidu.token-fetcher';
import { EthereumGoldfinchSeniorBondContractPositionFetcher } from './ethereum/goldfinch.senior-bond.contract-position-fetcher';
import { EthereumGoldfinchVaultContractPositionFetcher } from './ethereum/goldfinch.vault.contract-position-fetcher';
import { GoldfinchAppDefinition, GOLDFINCH_DEFINITION } from './goldfinch.definition';

@Register.AppModule({
  appId: GOLDFINCH_DEFINITION.id,
  providers: [
    GoldfinchAppDefinition,
    GoldfinchContractFactory,
    EthereumGoldfinchFiduTokenFetcher,
    EthereumGoldfinchSeniorBondContractPositionFetcher,
    EthereumGoldfinchVaultContractPositionFetcher,
  ],
})
export class GoldfinchAppModule extends AbstractApp() {}
