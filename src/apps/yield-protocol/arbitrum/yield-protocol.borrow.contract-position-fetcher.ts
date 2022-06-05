import { Inject } from '@nestjs/common';
import { gql } from 'graphql-request';
import { compact } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { DisplayProps } from '~position/display.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { borrowed, supplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { YieldProtocolContractFactory } from '../contracts';
import { YIELD_PROTOCOL_DEFINITION } from '../yield-protocol.definition';

import { LADLE } from './yield-protocol.balance-fetcher';
import { yieldV2ArbitrumSubgraph } from './yield-protocol.lend.token-fetcher';

const appId = YIELD_PROTOCOL_DEFINITION.id;
const groupId = YIELD_PROTOCOL_DEFINITION.groups.borrow.id;
const network = Network.ARBITRUM_MAINNET;

type YieldVaultsRes = {
  vaults: {
    series: {
      baseAsset: {
        id: string;
      };
    };
    collateral: {
      asset: {
        id: string;
      };
    };
  }[];
};

const vaultsQuery = gql`
  {
    vaults {
      series {
        baseAsset {
          id
        }
      }
      collateral {
        asset {
          id
        }
      }
    }
  }
`;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class ArbitrumYieldProtocolBorrowContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(YieldProtocolContractFactory) private readonly yieldProtocolContractFactory: YieldProtocolContractFactory,
  ) {}

  async getPositions() {
    const { vaults } = await this.appToolkit.helpers.theGraphHelper.request<YieldVaultsRes>({
      endpoint: yieldV2ArbitrumSubgraph,
      query: vaultsQuery,
    });

    // use distinct art/ilk pairs as positions
    const pairs: Map<string, { art: string; ilk: string }> = vaults.reduce((pairs, vault) => {
      const {
        series: {
          baseAsset: { id: artAddress },
        },
        collateral: {
          asset: { id: ilkAddress },
        },
      } = vault;

      const artIlk = artAddress + ilkAddress;
      const pairItem = { art: artAddress, ilk: ilkAddress };
      const newPairs = pairs;
      if (!pairs.has(artIlk)) {
        newPairs.set(artIlk, pairItem);
      }

      return newPairs;
    }, new Map());

    const positions = await Promise.all(
      [...pairs.values()].map(async pair => {
        const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
        const art = baseTokens.find(v => v.address === pair.art.toLowerCase());
        const ilk = baseTokens.find(v => v.address === pair.ilk.toLowerCase());

        if (!art || !ilk) return null;

        const tokens = [supplied(ilk!), borrowed(art!)];

        const displayProps: DisplayProps = {
          label: `Yield Debt/Collateral Pair`,
          secondaryLabel: `${getLabelFromToken(art)} Debt and ${getLabelFromToken(ilk)} Collateral`,
          images: [getImagesFromToken(art)[0], getImagesFromToken(ilk)[0]],
        };

        const position: ContractPosition = {
          type: ContractType.POSITION,
          appId,
          groupId,
          address: LADLE,
          network,
          tokens,
          dataProps: {},
          displayProps,
        };

        return position;
      }),
    );
    return compact(positions);
  }
}
