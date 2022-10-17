import { Inject, Injectable } from '@nestjs/common';
import { parseBytes32String } from 'ethers/lib/utils';
import { gql } from 'graphql-request';
import { sumBy } from 'lodash';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import {
  buildDollarDisplayItem,
  buildNumberDisplayItem,
  buildStringDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getAppAssetImage } from '~app-toolkit/helpers/presentation/image.present';
import { SYNTHETIX_DEFINITION } from '~apps/synthetix/synthetix.definition';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  DefaultContractPositionDefinition,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';
import { Network } from '~types';

import { KwentaContractFactory, KwentaFutures } from '../contracts';
import KWENTA_DEFINITION from '../kwenta.definition';

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

@Injectable()
export class OptimismKwentaPerpContractPositionFetcher extends ContractPositionTemplatePositionFetcher<KwentaFutures> {
  appId = KWENTA_DEFINITION.id;
  groupId = KWENTA_DEFINITION.groups.perp.id;
  network = Network.OPTIMISM_MAINNET;
  groupLabel = 'Perp';

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
    const contractsFromSubgraph = await this.appToolkit.helpers.theGraphHelper.requestGraph<GetContracts>({
      endpoint: 'https://api.thegraph.com/subgraphs/name/kwenta/optimism-main',
      query: getContractsQuery,
    });
    return contractsFromSubgraph.futuresMarkets.map(futuresMarket => ({ address: futuresMarket.id }));
  }

  async getTokenDefinitions() {
    return [
      { metaType: MetaType.SUPPLIED, address: '0x8c6f28f2f1a3c87f0f938b96d27520d9751ec8d9' }, // sUSD
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
    return `${baseAsset}-PERP`;
  }

  async getStatsItems({ contractPosition }) {
    const multicall = this.appToolkit.getMulticall(this.network);
    const contract = multicall.wrap(this.getContract(contractPosition.address));
    const currentFundingRateRaw = await contract.currentFundingRate();
    return [{ label: 'Funding Rate', value: buildNumberDisplayItem(Number(currentFundingRateRaw) / 10 ** 18) }];
  }

  async getImages({ contractPosition }: GetDisplayPropsParams<KwentaFutures>) {
    const baseAsset = await this.getBaseAsset({ contractPosition });
    return [getAppAssetImage(SYNTHETIX_DEFINITION.id, `s${baseAsset}`)];
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<KwentaFutures>) {
    const remainingMargin = await contract.remainingMargin(address);
    return [remainingMargin.marginRemaining];
  }

  async getBalances(address: string) {
    const multicall = this.appToolkit.getMulticall(this.network);
    const contractPositions = await this.appToolkit.getAppContractPositions({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });

    const balances = await Promise.all(
      contractPositions.map(async contractPosition => {
        const contract = multicall.wrap(this.getContract(contractPosition.address));
        const balancesRaw = await this.getTokenBalancesPerPosition({ address, contract, contractPosition, multicall });
        const allTokens = contractPosition.tokens.map((cp, idx) =>
          drillBalance(cp, balancesRaw[idx]?.toString() ?? '0', { isDebt: cp.metaType === MetaType.BORROWED }),
        );

        const tokens = allTokens.filter(v => Math.abs(v.balanceUSD) > 0.01);
        const balanceUSD = sumBy(tokens, t => t.balanceUSD);
        const enrichedDisplayItems = await this.getEnrichedDisplayItems({ address, contract });
        return { ...contractPosition, tokens, balanceUSD, displayItems: enrichedDisplayItems };
      }),
    );

    return balances;
  }

  private async getEnrichedDisplayItems({ address, contract }) {
    const position = await contract.positions(address);
    const positionSizeRaw = Number(position.size);
    if (positionSizeRaw === 0) {
      return [];
    }
    const liquidationPriceRaw = await contract.liquidationPrice(address);
    const pnlRaw = await contract.profitLoss(address);
    const notionalValueRaw = await contract.notionalValue(address);
    return [
      { label: 'Side', ...buildStringDisplayItem(positionSizeRaw > 0 ? 'LONG' : 'SHORT') },
      { label: 'Size', ...buildNumberDisplayItem(positionSizeRaw / 10 ** 18) },
      { label: 'Notional Value', ...buildDollarDisplayItem(Number(notionalValueRaw.value) / 10 ** 18) },
      { label: 'PnL', ...buildDollarDisplayItem(Number(pnlRaw.pnl) / 10 ** 18) },
      { label: 'Last Price', ...buildDollarDisplayItem(Number(position.lastPrice) / 10 ** 18) },
      { label: 'Liquidation Price', ...buildDollarDisplayItem(Number(liquidationPriceRaw.price) / 10 ** 18) },
    ];
  }
}
