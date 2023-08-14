import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDefinitionsParams,
  DefaultContractPositionDefinition,
  GetTokenDefinitionsParams,
  UnderlyingTokenDefinition,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';

import { Y2KFinanceCarousel, Y2KFinanceContractFactory } from '../contracts';

const carouselFactory = '0xc3179ac01b7d68aed4f27a19510ffe2bfb78ab3e';
const fromBlock = 96059531;

@PositionTemplate()
export class ArbitrumY2KFinanceMintV2ContractPositionFetcher extends ContractPositionTemplatePositionFetcher<Y2KFinanceCarousel> {
  groupLabel = 'Positions';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(Y2KFinanceContractFactory) protected readonly contractFactory: Y2KFinanceContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): Y2KFinanceCarousel {
    return this.contractFactory.y2KFinanceCarousel({ address, network: this.network });
  }

  async getDefinitions(_params: GetDefinitionsParams): Promise<DefaultContractPositionDefinition[]> {
    const factory = this.contractFactory.y2KFinanceCarouselFactory({ address: carouselFactory, network: this.network });
    const filter = factory.filters.MarketCreated();
    const events = await factory.queryFilter(filter, fromBlock);
    const vaults = events.map(e => [e.args.premium, e.args.collateral]).flat();
    return vaults.map(vault => ({ address: vault }));
  }

  async getTokenDefinitions(
    params: GetTokenDefinitionsParams<Y2KFinanceCarousel, DefaultContractPositionDefinition>,
  ): Promise<UnderlyingTokenDefinition[] | null> {
    const epochIds = await params.contract.getAllEpochs();
    const claimableAsset = await params.contract.asset();
    const emission = await params.contract.emissionsToken();
    return epochIds
      .map(id => [
        {
          metaType: MetaType.SUPPLIED,
          address: params.contract.address,
          network: this.network,
          tokenId: id.toNumber(),
        },
        {
          metaType: MetaType.CLAIMABLE,
          address: claimableAsset,
          network: this.network,
          tokenId: id.toNumber(),
        },
        {
          metaType: MetaType.CLAIMABLE,
          address: emission,
          network: this.network,
        },
      ])
      .flat();
  }

  async getLabel(
    params: GetDisplayPropsParams<Y2KFinanceCarousel, DefaultDataProps, DefaultContractPositionDefinition>,
  ): Promise<string> {
    const name = await params.contract.name();
    return name;
  }

  async getTokenBalancesPerPosition(
    params: GetTokenBalancesParams<Y2KFinanceCarousel, DefaultDataProps>,
  ): Promise<BigNumberish[]> {
    const epochIds = await params.contract.getAllEpochs();
    const vault = params.multicall.wrap(params.contract);
    const results = await Promise.all(
      epochIds.map(async id => {
        const balance = await vault.balanceOf(params.address, id);
        const claimable = await vault.previewWithdraw(id, balance);
        const emission = await vault.previewEmissionsWithdraw(id, balance);
        return [balance, claimable, emission];
      }),
    );
    return results.flat();
  }
}
