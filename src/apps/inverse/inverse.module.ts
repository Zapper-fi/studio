import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { SynthetixContractFactory } from '~apps/synthetix';

import { InverseContractFactory } from './contracts';
import { EthereumInverseBorrowContractPositionFetcher } from './ethereum/inverse.borrow.contract-position-fetcher';
import { EthereumInverseClaimableContractPositionFetcher } from './ethereum/inverse.claimable.contract-position-fetcher';
import { EthereumInverseDcaVaultDividendContractPositionFetcher } from './ethereum/inverse.dca-vault-dividend.contract-position-fetcher';
import { EthereumInverseDcaVaultTokenFetcher } from './ethereum/inverse.dca-vault.token-fetcher';
import { EthereumInverseFarmContractPositionFetcher } from './ethereum/inverse.farm.contract-position-fetcher';
import { EthereumInverseSupplyTokenFetcher } from './ethereum/inverse.supply.token-fetcher';
import { InverseAppDefinition, INVERSE_DEFINITION } from './inverse.definition';

@Register.AppModule({
  appId: INVERSE_DEFINITION.id,
  providers: [
    InverseAppDefinition,
    InverseContractFactory,
    SynthetixContractFactory,
    EthereumInverseBorrowContractPositionFetcher,
    EthereumInverseClaimableContractPositionFetcher,
    EthereumInverseDcaVaultTokenFetcher,
    EthereumInverseDcaVaultDividendContractPositionFetcher,
    EthereumInverseFarmContractPositionFetcher,
    EthereumInverseSupplyTokenFetcher,
  ],
})
export class InverseAppModule extends AbstractApp() {}
