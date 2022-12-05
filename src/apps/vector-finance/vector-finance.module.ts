import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { VectorFinanceFarmContractPositionFetcher } from './avalanche/vector-finance.farm.contract-position-fetcher';
import { VectorFinanceContractFactory } from './contracts';
import { VectorFinanceAppDefinition, VECTOR_FINANCE_DEFINITION } from './vector-finance.definition';

@Register.AppModule({
  appId: VECTOR_FINANCE_DEFINITION.id,
  providers: [VectorFinanceAppDefinition, VectorFinanceContractFactory, VectorFinanceFarmContractPositionFetcher],
})
export class VectorFinanceAppModule extends AbstractApp() {}
