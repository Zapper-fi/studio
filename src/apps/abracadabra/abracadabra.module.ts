import { Register } from '~app-toolkit/decorators';
import { AbstractApp, ExternalAppImport } from '~app/app.dynamic-module';
import { OlympusAppModule } from '~apps/olympus';

import { AbracadabraAppDefinition, ABRACADABRA_DEFINITION } from './abracadabra.definition';
import { ArbitrumAbracadabraBalanceFetcher } from './arbitrum/abracadabra.balance-fetcher';
import { ArbitrumAbracadabraCauldronContractPositionFetcher } from './arbitrum/abracadabra.cauldron.contract-position-fetcher';
import { ArbitrumAbracadabraFarmContractPositionFetcher } from './arbitrum/abracadabra.farm.contract-position-fetcher';
import { ArbitrumAbracadabraStakedSpellTokenFetcher } from './arbitrum/abracadabra.staked-spell.token-fetcher';
import { AvalancheAbracadabraBalanceFetcher } from './avalanche/abracadabra.balance-fetcher';
import { AvalancheAbracadabraCauldronContractPositionFetcher } from './avalanche/abracadabra.cauldron.contract-position-fetcher';
import { AvalancheAbracadabraFarmContractPositionFetcher } from './avalanche/abracadabra.farm.contract-position-fetcher';
import { AvalancheAbracadabraStakedSpellTokenFetcher } from './avalanche/abracadabra.staked-spell.token-fetcher';
import { AbracadabraContractFactory } from './contracts';
import { EthereumAbracadabraBalanceFetcher } from './ethereum/abracadabra.balance-fetcher';
import { EthereumAbracadabraCauldronContractPositionFetcher } from './ethereum/abracadabra.cauldron.contract-position-fetcher';
import { EthereumAbracadabraFarmContractPositionFetcher } from './ethereum/abracadabra.farm.contract-position-fetcher';
import { EthereumAbracadabraStakedSpellTokenFetcher } from './ethereum/abracadabra.staked-spell.token-fetcher';
import { FantomAbracadabraBalanceFetcher } from './fantom/abracadabra.balance-fetcher';
import { FantomAbracadabraCauldronContractPositionFetcher } from './fantom/abracadabra.cauldron.contract-position-fetcher';
import { FantomAbracadabraFarmContractPositionFetcher } from './fantom/abracadbra.farm.contract-position-fetcher';
import { FantomAbracadabraStakedSpellTokenFetcher } from './fantom/abracadbra.staked-spell.token-fetcher';
import { AbracadabraCauldronBalanceHelper } from './helpers/abracadabra.cauldron.balance-helper';
import { AbracadabraCauldronContractPositionHelper } from './helpers/abracadabra.cauldron.contract-position-helper';

@Register.AppModule({
  appId: ABRACADABRA_DEFINITION.id,
  imports: ExternalAppImport(OlympusAppModule),
  providers: [
    AbracadabraAppDefinition,
    AbracadabraContractFactory,
    // Arbitrum
    ArbitrumAbracadabraStakedSpellTokenFetcher,
    ArbitrumAbracadabraCauldronContractPositionFetcher,
    ArbitrumAbracadabraFarmContractPositionFetcher,
    ArbitrumAbracadabraBalanceFetcher,
    // Avalanche
    AvalancheAbracadabraStakedSpellTokenFetcher,
    AvalancheAbracadabraCauldronContractPositionFetcher,
    AvalancheAbracadabraFarmContractPositionFetcher,
    AvalancheAbracadabraBalanceFetcher,
    // Ethereum
    EthereumAbracadabraStakedSpellTokenFetcher,
    EthereumAbracadabraCauldronContractPositionFetcher,
    EthereumAbracadabraFarmContractPositionFetcher,
    EthereumAbracadabraBalanceFetcher,
    // Fantom
    FantomAbracadabraStakedSpellTokenFetcher,
    FantomAbracadabraCauldronContractPositionFetcher,
    FantomAbracadabraFarmContractPositionFetcher,
    FantomAbracadabraBalanceFetcher,
    // Helpers
    AbracadabraCauldronBalanceHelper,
    AbracadabraCauldronContractPositionHelper,
  ],
})
export class AbracadabraAppModule extends AbstractApp() {}
