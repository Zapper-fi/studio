import { Inject } from '@nestjs/common';
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

import { formatMaturity, yieldV2MainnetSubgraph } from './yield-protocol.lend.token-fetcher';

const appId = YIELD_PROTOCOL_DEFINITION.id;
const groupId = YIELD_PROTOCOL_DEFINITION.groups.borrow.id;
const network = Network.ETHEREUM_MAINNET;

type YieldRes = {
  vaults: YieldVaultsRes[];
};

type YieldVaultsRes = {
  id: string;
  owner: string;
  debtAmount: number;
  collateralAmount: number;
  series: {
    maturity: number;
    matured: boolean;
    baseAsset: {
      id: string;
    };
  };
  collateral: {
    asset: {
      id: string;
    };
  };
};

type FyTokenDataProps = {
  matured: boolean;
};

const query = `
{
  vaults {
      id
      owner
      debtAmount
      collateralAmount
    	series {
        maturity
        matured
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

  async getYieldDetails() {
    return await this.appToolkit.helpers.theGraphHelper.request<YieldRes>({
      endpoint: yieldV2MainnetSubgraph,
      query,
    });
  }

  async getPositions() {
    const { vaults } = await this.getYieldDetails();
    const positions = await Promise.all(
      vaults.slice(0, 5).map(async vault => {
        const {
          id: vaultId,
          owner,
          debtAmount,
          collateralAmount,
          series: {
            maturity,
            matured,
            baseAsset: { id: artAddress },
          },
          collateral: {
            asset: { id: ilkAddress },
          },
        } = vault;

        // get the corresponding art (debt) and ilk (collateral) of the vault
        const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
        const art = baseTokens.find(v => v.address === artAddress.toLowerCase());
        const ilk = baseTokens.find(v => v.address === ilkAddress.toLowerCase());

        if (!art || !ilk) return null;

        const dataProps: FyTokenDataProps = {
          matured,
        };

        const maturity_ = formatMaturity(maturity);
        const displayProps: DisplayProps = {
          label: `Yield Vault`,
          secondaryLabel: `${getLabelFromToken(art)} Debt and ${getLabelFromToken(ilk)} Collateral`,
          tertiaryLabel: maturity_,
          images: [getImagesFromToken(art)[0], getImagesFromToken(ilk)[0]],
        };
        const position: ContractPosition = {
          type: ContractType.POSITION,
          appId,
          groupId,
          address: owner, // using the owner here, to use when fetching single vault in balance fetch
          network,
          tokens: [borrowed(art), supplied(ilk)],
          dataProps,
          displayProps,
        };
        return position;
      }),
    );
    return compact(positions);
  }
}
