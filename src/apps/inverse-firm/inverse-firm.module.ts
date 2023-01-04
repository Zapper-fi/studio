import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { InverseFirmContractFactory } from './contracts';
import { EthereumInverseFirmLoanContractPositionFetcher } from './ethereum/inverse-firm.loan.contract-position-fetcher';
import { EthereumInverseFirmDbrContractPositionFetcher } from './ethereum/inverse-firm.dbr.contract-position-fetcher';
import { EthereumInverseFirmBalanceFetcher } from './ethereum/inverse-firm.balance-fetcher';
import { InverseFirmAppDefinition, INVERSE_FIRM_DEFINITION } from './inverse-firm.definition';

@Register.AppModule({
  appId: INVERSE_FIRM_DEFINITION.id,
  imports: [],
  providers: [
    InverseFirmAppDefinition,
    InverseFirmContractFactory,
    EthereumInverseFirmLoanContractPositionFetcher,
    EthereumInverseFirmDbrContractPositionFetcher,
    EthereumInverseFirmBalanceFetcher,
  ],
})
export class InverseFirmAppModule extends AbstractApp() { }
