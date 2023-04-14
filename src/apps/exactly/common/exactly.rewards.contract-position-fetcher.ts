import { Inject } from '@nestjs/common';
import { constants } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import type {
  GetDefinitionsParams,
  GetTokenDefinitionsParams,
  GetTokenBalancesParams,
  GetDisplayPropsParams,
  DefaultContractPositionDefinition,
} from '~position/template/contract-position.template.types';

import { ExactlyContractFactory, Previewer } from '../contracts';

import {
  ExactlyDefinitionsResolver,
  type ExactlyMarketDefinition,
  PREVIEWER_ADDRESSES,
} from './exactly.definitions-resolver';
import type { ExactlyMarketProps } from './exactly.token-fetcher';

type ExactlyDefinition = DefaultContractPositionDefinition & { exactly: ExactlyMarketDefinition[] };

export abstract class ExactlyRewardsFetcher extends ContractPositionTemplatePositionFetcher<
  Previewer,
  ExactlyMarketProps,
  ExactlyDefinition
> {
  groupLabel = 'Rewards';
  isExcludedFromExplore = true;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ExactlyContractFactory) protected readonly contractFactory: ExactlyContractFactory,
    @Inject(ExactlyDefinitionsResolver) protected readonly definitionsResolver: ExactlyDefinitionsResolver,
  ) {
    super(appToolkit);
  }

  async getDefinitions({ multicall }: GetDefinitionsParams) {
    const exactly = await this.definitionsResolver.getDefinitions({ multicall, network: this.network });
    return [{ address: PREVIEWER_ADDRESSES[this.network]!, exactly }];
  }

  getContract(address: string) {
    return this.contractFactory.previewer({ address, network: this.network });
  }

  getLabel({ contractPosition }: GetDisplayPropsParams<Previewer, ExactlyMarketProps, ExactlyDefinition>) {
    return Promise.resolve(contractPosition.tokens.map(asset => getLabelFromToken(asset)).join(' - '));
  }

  getTokenDefinitions({ definition }: GetTokenDefinitionsParams<Previewer, ExactlyDefinition>) {
    return Promise.resolve(
      [
        ...new Set(
          definition.exactly.flatMap(({ rewardRates }) => rewardRates.map(({ asset }) => asset.toLowerCase())),
        ),
      ].map(asset => ({ metaType: MetaType.CLAIMABLE, address: asset.toLowerCase(), network: this.network })),
    );
  }

  async getTokenBalancesPerPosition({
    address,
    multicall,
    contractPosition,
  }: GetTokenBalancesParams<Previewer, ExactlyMarketProps>) {
    const exactly = await this.definitionsResolver.getDefinitions({
      multicall,
      network: this.network,
      account: address,
    });
    return contractPosition.tokens.map(({ address: assetAddress }) =>
      exactly.reduce(
        (total, { claimableRewards }) =>
          total.add(claimableRewards.find(({ asset }) => asset.toLowerCase() === assetAddress)?.amount ?? 0),
        constants.Zero,
      ),
    );
  }
}
