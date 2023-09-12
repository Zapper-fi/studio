import { Inject } from '@nestjs/common';
import { ethers } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { gql } from 'graphql-request';
import { compact, isEqual, sumBy, uniqWith } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { drillBalance } from '~app-toolkit/helpers/drill-balance.helper';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';
import { ContractType } from '~position/contract.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { MetaType } from '~position/position.interface';
import { borrowed, supplied } from '~position/position.utils';
import { GetDefinitionsParams } from '~position/template/app-token.template.types';
import {
  GetTokenDefinitionsParams,
  GetDisplayPropsParams,
  GetDataPropsParams,
} from '~position/template/contract-position.template.types';
import { CustomContractPositionTemplatePositionFetcher } from '~position/template/custom-contract-position.template.position-fetcher';

import { YieldProtocolContractFactory, YieldProtocolLadle } from '../contracts';

import { formatMaturity } from './yield-protocol.lend.token-fetcher';

export type YieldIlksRes = {
  assets: {
    id: string;
    assetId: string | null;
  }[];
};

export type YieldArtsRes = {
  seriesEntities: {
    baseAsset: {
      id: string;
      assetId: string;
    };
  }[];
};

export type YieldVaultContractPositionDataProps = {
  minCollateralizationRatio: string;
};

export const ilksQuery = gql`
  {
    assets {
      id
      assetId
    }
  }
`;

export const artsQuery = gql`
  {
    seriesEntities {
      baseAsset {
        id
        assetId
      }
    }
  }
`;

export type YieldProtocolBorrowDefinition = {
  address: string;
  ilkId: string;
  artId: string;
  ilkAddress: string;
  artAddress: string;
};

export type YieldProtocolBorrowDataProps = {
  ilkId: string;
  artId: string;
  minCollateralizationRatio: number;
  collateralizationRatio?: number;
  liquidationPrice?: number;
};

type YieldVaultRes = {
  account?: {
    id: string;
    vaults: {
      debtAmount: number;
      collateralAmount: number;
      series: {
        baseAsset: {
          id: string;
          assetId: string;
        };
        fyToken: {
          maturity: number;
        };
      };
      collateral: {
        asset: {
          id: string;
          assetId: string;
        };
      };
    }[];
  };
};

const vaultsQuery = gql`
  query ($address: ID!) {
    account(id: $address) {
      id
      vaults {
        debtAmount
        collateralAmount
        series {
          baseAsset {
            id
            assetId
          }
          fyToken {
            maturity
          }
        }
        collateral {
          asset {
            id
            assetId
          }
        }
      }
    }
  }
`;

export abstract class YieldProtocolBorrowContractPositionFetcher extends CustomContractPositionTemplatePositionFetcher<
  YieldProtocolLadle,
  YieldProtocolBorrowDataProps,
  YieldProtocolBorrowDefinition
> {
  abstract subgraphUrl: string;
  abstract cauldronAddress: string;
  abstract ladleAddress: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(YieldProtocolContractFactory) protected readonly contractFactory: YieldProtocolContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): YieldProtocolLadle {
    return this.contractFactory.yieldProtocolLadle({ address, network: this.network });
  }

  async getDefinitions({ multicall }: GetDefinitionsParams) {
    const cauldron = this.contractFactory.yieldProtocolCauldron({
      address: this.cauldronAddress,
      network: this.network,
    });

    const { assets: ilks } = await gqlFetch<YieldIlksRes>({ endpoint: this.subgraphUrl, query: ilksQuery });
    const { seriesEntities: artsRes } = await gqlFetch<YieldArtsRes>({ endpoint: this.subgraphUrl, query: artsQuery });

    // get distinct debt assets
    const distinctArts = uniqWith(artsRes, isEqual);

    const definitionsByIlk = await Promise.all(
      ilks.map(async ilk => {
        const { assetId: ilkId, id: ilkAddress } = ilk;
        if (!ilkId) return [];

        return Promise.all(
          distinctArts.map(async art => {
            const { assetId: artId, id: artAddress } = art.baseAsset;

            // assume this is an invalid art/ilk pair if the max debt has not been set
            const { max: maxDebt } = await multicall.wrap(cauldron).debt(artId, ilkId);
            if (maxDebt.eq(ethers.constants.Zero)) return null;

            return { address: this.ladleAddress, ilkId, artId, ilkAddress, artAddress };
          }),
        );
      }),
    );

    return compact(definitionsByIlk.flat());
  }

  async getTokenDefinitions({
    definition,
  }: GetTokenDefinitionsParams<YieldProtocolLadle, YieldProtocolBorrowDefinition>) {
    return [
      { metaType: MetaType.SUPPLIED, address: definition.ilkAddress, network: this.network },
      { metaType: MetaType.BORROWED, address: definition.artAddress, network: this.network },
    ];
  }

  async getDataProps(
    params: GetDataPropsParams<YieldProtocolLadle, YieldProtocolBorrowDataProps, YieldProtocolBorrowDefinition>,
  ) {
    const { definition, multicall } = params;
    const cauldron = this.contractFactory.yieldProtocolCauldron({
      address: this.cauldronAddress,
      network: this.network,
    });

    const { artId, ilkId } = definition;
    const { ratio } = await multicall.wrap(cauldron).spotOracles(artId, ilkId);
    const minCollateralizationRatio = ratio / 10 ** 6; // ratio uses 6 decimals for all pairs

    const defaultDataProps = await super.getDataProps(params);
    return { ...defaultDataProps, artId, ilkId, minCollateralizationRatio };
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<YieldProtocolLadle>) {
    return `Yield ${getLabelFromToken(contractPosition.tokens[0])} Debt and ${getLabelFromToken(
      contractPosition.tokens[1],
    )} Collateral`;
  }

  async getTokenBalancesPerPosition(): Promise<ethers.BigNumberish[]> {
    throw new Error('Method not implemented.');
  }

  async getBalances(address: string): Promise<ContractPositionBalance<YieldProtocolBorrowDataProps>[]> {
    const multicall = this.appToolkit.getMulticall(this.network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(this.network);

    const cauldron = this.contractFactory.yieldProtocolCauldron({
      address: this.cauldronAddress,
      network: this.network,
    });

    const data = await gqlFetch<YieldVaultRes>({
      endpoint: this.subgraphUrl,
      query: vaultsQuery,
      variables: { address },
    });

    const account = data.account;
    if (!account) return [];

    const positions = await Promise.all(
      account.vaults.map(async vault => {
        const {
          debtAmount,
          collateralAmount,
          series: {
            baseAsset: { id: artAddress, assetId: artId },
            fyToken: { maturity },
          },
          collateral: {
            asset: { id: ilkAddress, assetId: ilkId },
          },
        } = vault;

        // get the corresponding art (debt) and ilk (collateral) of the vault
        const art = baseTokens.find(v => v.address === artAddress.toLowerCase());
        const ilk = baseTokens.find(v => v.address === ilkAddress.toLowerCase());
        if (!art || !ilk) return null;

        // data props
        const collateral = drillBalance(
          supplied(ilk),
          parseUnits(collateralAmount.toString(), ilk.decimals).toString(),
        );
        const debt = drillBalance(borrowed(art), parseUnits(debtAmount.toString(), art.decimals).toString(), {
          isDebt: true,
        });
        const tokens = [collateral, debt];
        const balanceUSD = sumBy(tokens, v => v.balanceUSD);
        const collateralizationRatio =
          debt.balanceUSD === 0 ? 0 : (collateral.balanceUSD / Math.abs(debt.balanceUSD)) * 100;

        const { ratio } = await multicall.wrap(cauldron).spotOracles(artId, ilkId);
        const minCollateralizationRatio = ratio / 10 ** 6; // ratio uses 6 decimals for all pairs
        const liquidationPrice = (debtAmount * minCollateralizationRatio) / collateralAmount;

        // display props
        const yieldLabel = `Yield ${getLabelFromToken(art)} Debt and ${getLabelFromToken(ilk)} Collateral Vault`;
        const label = `${yieldLabel} - ${formatMaturity(maturity)}`;
        const images = [getImagesFromToken(art)[0], getImagesFromToken(ilk)[0]];

        const positionBalance: ContractPositionBalance<YieldProtocolBorrowDataProps> = {
          type: ContractType.POSITION,
          address: this.ladleAddress, // use the ladle here because the user interacts with the ladle to open a position
          appId: this.appId,
          groupId: this.groupId,
          network: this.network,
          tokens,
          balanceUSD,

          dataProps: {
            ilkId,
            artId,
            minCollateralizationRatio,
            collateralizationRatio,
            liquidationPrice,
          },

          displayProps: {
            label,
            images,
          },
        };

        positionBalance.key = this.appToolkit.getPositionKey(positionBalance);

        return positionBalance;
      }),
    );

    return compact(positions);
  }
}
