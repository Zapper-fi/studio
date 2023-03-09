import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

import { SiloFinanceDefinitionResolver } from '../common/silo-finance.definition-resolver';
import { SiloFinanceContractFactory, SiloMarketAsset } from '../contracts';

@PositionTemplate()
export class EthereumMarketAssetsTokenFetcher extends AppTokenTemplatePositionFetcher<SiloMarketAsset> {
  groupLabel = 'Market Assets';

  isExcludedFromBalances = true;
  isExcludedFromExplore = true;
  isExcludedFromTvl = true;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SiloFinanceContractFactory) protected readonly contractFactory: SiloFinanceContractFactory,
    @Inject(SiloFinanceDefinitionResolver)
    protected readonly siloDefinitionResolver: SiloFinanceDefinitionResolver,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.siloMarketAsset({ address, network: this.network });
  }

  async getAddresses() {
    const marketAssets = await this.siloDefinitionResolver.getSiloMarketAssetsDefinition(this.network);
    if (!marketAssets) return [];

    return marketAssets;
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<SiloMarketAsset>) {
    return [{ address: await contract.asset(), network: this.network }];
  }

  async getPricePerShare() {
    return [1];
  }
}
