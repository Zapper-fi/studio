import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { gql } from 'graphql-request';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';
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

import { Y2KFinanceViemContractFactory } from '../contracts';
import { Y2KFinanceCarousel } from '../contracts/viem';

export const VAULTS_QUERY = gql`
  {
    vaults(where: { isV2: true }) {
      address
    }
  }
`;

export type VaultsResponse = {
  vaults: {
    address: string;
  }[];
};

@PositionTemplate()
export class ArbitrumY2KFinanceMintV2ContractPositionFetcher extends ContractPositionTemplatePositionFetcher<Y2KFinanceCarousel> {
  groupLabel = 'Positions';
  subgraphUrl = 'https://subgraph.satsuma-prod.com/a30e504dd617/y2k-finance/v2-prod/api';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(Y2KFinanceViemContractFactory) protected readonly contractFactory: Y2KFinanceViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.y2KFinanceCarousel({ address, network: this.network });
  }

  async getDefinitions(_params: GetDefinitionsParams): Promise<DefaultContractPositionDefinition[]> {
    const vaultsResponse = await gqlFetch<VaultsResponse>({
      endpoint: this.subgraphUrl,
      query: VAULTS_QUERY,
    });
    return vaultsResponse.vaults.map(vault => ({ address: vault.address }));
  }

  async getTokenDefinitions(
    params: GetTokenDefinitionsParams<Y2KFinanceCarousel, DefaultContractPositionDefinition>,
  ): Promise<UnderlyingTokenDefinition[] | null> {
    const epochIdsRaw = await params.contract.read.getAllEpochs();
    const claimableAsset = await params.contract.read.asset();
    const emission = await params.contract.read.emissionsToken();
    const epochIds = epochIdsRaw.map(x => x.toString());
    return epochIds
      .map(tokenId => [
        {
          metaType: MetaType.SUPPLIED,
          address: params.contract.address,
          // address: '0x892785f33cdee22a30aef750f285e18c18040c3e',
          network: this.network,
          tokenId,
        },
        {
          metaType: MetaType.CLAIMABLE,
          address: claimableAsset,
          network: this.network,
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
    const name = await params.contract.read.name();
    return name;
  }

  async getTokenBalancesPerPosition(
    params: GetTokenBalancesParams<Y2KFinanceCarousel, DefaultDataProps>,
  ): Promise<BigNumberish[]> {
    const epochIds = await params.contract.read.getAllEpochs();
    const vault = params.multicall.wrap(params.contract);
    const results = await Promise.all(
      epochIds.map(async id => {
        const finalTVL = await vault.read.finalTVL([id]);
        const balance = await vault.read.balanceOf([params.address, id]);
        if (Number(finalTVL) === 0 || Number(balance) === 0) return [0, 0, 0];

        const claimable = await vault.read.previewWithdraw([id, balance]);
        const emission = await vault.read.previewEmissionsWithdraw([id, balance]);
        return [balance, claimable, emission];
      }),
    );
    return results.flat();
  }
}
