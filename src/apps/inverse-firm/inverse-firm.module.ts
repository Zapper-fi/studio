import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { InverseFirmContractFactory } from './contracts';
import { EthereumInverseFirmLoanContractPositionFetcher } from './ethereum/inverse-firm.loan.contract-position-fetcher';
import { InverseFirmAppDefinition, INVERSE_FIRM_DEFINITION } from './inverse-firm.definition';

@Register.AppModule({
  appId: INVERSE_FIRM_DEFINITION.id,
  providers: [InverseFirmAppDefinition, InverseFirmContractFactory, EthereumInverseFirmLoanContractPositionFetcher],
})
export class InverseFirmAppModule extends AbstractApp() {}
