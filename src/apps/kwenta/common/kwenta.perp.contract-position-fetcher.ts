import { Inject } from '@nestjs/common';
import { parseBytes32String } from 'ethers/lib/utils';
import { gql } from 'graphql-request';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getAppAssetImage } from '~app-toolkit/helpers/presentation/image.present';
import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  DefaultContractPositionDefinition,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';
import { PerpV2MarketAddresses } from '../../synthetix/optimism/synthetix.perp-v2.contract-position-fetcher';

import { KwentaContractFactory, KwentaFutures } from '../contracts';

type GetContracts = {
  futuresMarkets: {
    id: string;
  }[];
};

const getContractsQuery = gql`
  query MyQuery {
    futuresMarkets {
      id
    }
  }
`;

export abstract class OptimismKwentaPerpContractPositionFetcher extends ContractPositionTemplatePositionFetcher<KwentaFutures> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(KwentaContractFactory) protected readonly contractFactory: KwentaContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): KwentaFutures {
    return this.contractFactory.kwentaFutures({ address, network: this.network });
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    const contractsFromSubgraph = await gqlFetch<GetContracts>({
      endpoint: 'https://api.thegraph.com/subgraphs/name/kwenta/optimism-main',
      query: getContractsQuery,
    });

    return contractsFromSubgraph.futuresMarkets.filter((market) => {
      const isPerpV2Market = PerpV2MarketAddresses.find(element => element.address === market.id);
      return !isPerpV2Market;
    }
    ).map(futuresMarket => ({ address: futuresMarket.id }));
  }

  async getTokenDefinitions() {
    return [
      {
        address: '0x8c6f28f2f1a3c87f0f938b96d27520d9751ec8d9', // sUSD
        metaType: MetaType.SUPPLIED,
        network: this.network,
      },
    ];
  }

  private async getBaseAsset({ contractPosition }) {
    const multicall = this.appToolkit.getMulticall(this.network);
    const contract = multicall.wrap(this.getContract(contractPosition.address));
    const baseAssetRaw = await contract.baseAsset();
    let baseAsset = parseBytes32String(baseAssetRaw);
    //some market use legacy naming starting with an "s"
    if (baseAsset.charAt(0) === 's') {
      baseAsset = baseAsset.substring(1);
    }
    return baseAsset;
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<KwentaFutures>): Promise<string> {
    const baseAsset = await this.getBaseAsset({ contractPosition });
    const marginType = this.groupId;
    return `${baseAsset}-PERP (${marginType})`;
  }

  async getImages({ contractPosition }: GetDisplayPropsParams<KwentaFutures>) {
    const baseAsset = await this.getBaseAsset({ contractPosition });
    return [getAppAssetImage('synthetix', `s${baseAsset}`)];
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<KwentaFutures>) {
    const remainingMargin = await contract.remainingMargin(address);
    return [remainingMargin.marginRemaining];
  }
}
