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

import { CAULDRON } from './yield-protocol.balance-fetcher';
import { yieldV2MainnetSubgraph } from './yield-protocol.lend.token-fetcher';

const appId = YIELD_PROTOCOL_DEFINITION.id;
const groupId = YIELD_PROTOCOL_DEFINITION.groups.borrow.id;
const network = Network.ETHEREUM_MAINNET;

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
export class EthereumYieldProtocolBorrowContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(YieldProtocolContractFactory) private readonly yieldProtocolContractFactory: YieldProtocolContractFactory,
  ) {}

  async getPositions() {
    const { vaults } = await this.appToolkit.helpers.theGraphHelper.request<YieldVaultsRes>({
      endpoint: yieldV2MainnetSubgraph,
      query: vaultsQuery,
    });

    // use distinct art/ilk pairs as positions
    const pairs = new Set([...vaults.map(v => ({ art: v.series.baseAsset.id, ilk: v.collateral.asset.id }))]);

    const positions = await Promise.all(
      [...pairs.values()].map(async pair => {
        const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
        const art = baseTokens.find(v => v.address === pair.art.toLowerCase());
        const ilk = baseTokens.find(v => v.address === pair.ilk.toLowerCase());

        if (!art || !ilk) return null;

        const tokens = [supplied(ilk!), borrowed(art!)];

        const displayProps: DisplayProps = {
          label: `Yield Vault`,
          secondaryLabel: `${getLabelFromToken(art)} Debt and ${getLabelFromToken(ilk)} Collateral`,
          images: [getImagesFromToken(art)[0], getImagesFromToken(ilk)[0]],
        };

        const position: ContractPosition = {
          type: ContractType.POSITION,
          appId,
          groupId,
          address: CAULDRON,
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
