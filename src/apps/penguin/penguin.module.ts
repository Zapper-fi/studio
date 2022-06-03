import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AvalanchePenguinBalanceFetcher } from './avalanche/penguin.balance-fetcher';
import { AvalanchePenguinChefV1FarmContractPositionFetcher } from './avalanche/penguin.chef-v1-farm.contract-position-fetcher';
import { AvalanchePenguinChefV2FarmContractPositionFetcher } from './avalanche/penguin.chef-v2-farm.contract-position-fetcher';
import { AvalanchePenguinIPefiTokenFetcher } from './avalanche/penguin.i-pefi.token-fetcher';
import { AvalanchePenguinVaultClaimableContractPositionFetcher } from './avalanche/penguin.vault-claimable.contract-position-fetcher';
import { AvalanchePenguinVaultTokenFetcher } from './avalanche/penguin.vault.token-fetcher';
import { AvalanchePenguinXPefiTokenFetcher } from './avalanche/penguin.x-pefi.token-fetcher';
import { PenguinContractFactory } from './contracts';
import { PenguinAppDefinition, PENGUIN_DEFINITION } from './penguin.definition';

@Register.AppModule({
  appId: PENGUIN_DEFINITION.id,
  providers: [
    PenguinAppDefinition,
    PenguinContractFactory,
    AvalanchePenguinBalanceFetcher,
    AvalanchePenguinChefV1FarmContractPositionFetcher,
    AvalanchePenguinChefV2FarmContractPositionFetcher,
    AvalanchePenguinIPefiTokenFetcher,
    AvalanchePenguinXPefiTokenFetcher,
    AvalanchePenguinVaultTokenFetcher,
    AvalanchePenguinVaultClaimableContractPositionFetcher,
  ],
})
export class PenguinAppModule extends AbstractApp() {}
