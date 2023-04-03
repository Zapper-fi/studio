import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { SiloFinanceContractFactory, SiloIncentives } from '../contracts';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { SiloFinanceDefinitionResolver } from './silo-finance.definition-resolver';
import { MetaType } from '~position/position.interface';
import {
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';

export abstract class SiloFinanceIncentivesContractPositionfetcher extends ContractPositionTemplatePositionFetcher<SiloIncentives>
{
  abstract incentivesAddress: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SiloFinanceContractFactory) protected readonly contractFactory: SiloFinanceContractFactory,
    @Inject(SiloFinanceDefinitionResolver)
    protected readonly siloDefinitionResolver: SiloFinanceDefinitionResolver,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.siloIncentives({ address, network: this.network });
  }

  async getDefinitions() {
    return [{ address: this.incentivesAddress }]
  }

  async getTokenDefinitions({ contract }) {
    return [
      {
        address: await contract.REWARD_TOKEN(),
        metaType: MetaType.CLAIMABLE,
        network: this.network,
      },
    ];
  }

  async getLabel() {
    return 'Claimable Silo';
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<SiloIncentives>): Promise<BigNumberish[]> {
    const markets = await this.siloDefinitionResolver.getSiloDefinition(this.network);
    if (!markets) return [];

    const assets = markets.map(market => {
      return market.marketAssets.map(marketAsset => { return marketAsset.sToken });
    }).flat();

    return [await contract.getRewardsBalance(assets, address)];
  }
}