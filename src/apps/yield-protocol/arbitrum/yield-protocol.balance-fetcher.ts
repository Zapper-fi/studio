import { Inject } from '@nestjs/common';
import { parseUnits } from 'ethers/lib/utils';
import { gql } from 'graphql-request';
import { compact, sumBy } from 'lodash';

import { drillBalance } from '~app-toolkit';
import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { ContractType } from '~position/contract.interface';
import { DisplayProps } from '~position/display.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { Network } from '~types/network.interface';

import { YieldProtocolContractFactory } from '../contracts';
import { formatMaturity } from '../ethereum/yield-protocol.lend.token-fetcher';
import { YIELD_PROTOCOL_DEFINITION } from '../yield-protocol.definition';

import { yieldV2ArbitrumSubgraph } from './yield-protocol.lend.token-fetcher';

const network = Network.ARBITRUM_MAINNET;
const appId = YIELD_PROTOCOL_DEFINITION.id;
const CAULDRON = '0x23cc87FBEBDD67ccE167Fa9Ec6Ad3b7fE3892E30';

type YieldVaultRes = {
  vaultOwner: {
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

type YieldVaultContractPositionDataProps = {
  collateralizationRatio: string;
  minCollateralizationRatio: string;
  liquidationPrice: string;
};

const vaultsQuery = gql`
  query ($address: ID!) {
    vaultOwner(id: $address) {
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

@Register.BalanceFetcher(YIELD_PROTOCOL_DEFINITION.id, network)
export class ArbitrumYieldProtocolBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(YieldProtocolContractFactory) private readonly yieldProtocolContractFactory: YieldProtocolContractFactory,
  ) {}

  private async getBorrowBalances(address: string) {
    const {
      vaultOwner: { vaults },
    } = await this.appToolkit.helpers.theGraphHelper.request<YieldVaultRes>({
      endpoint: yieldV2ArbitrumSubgraph,
      query: vaultsQuery,
      variables: { address },
    });

    const positions = await Promise.all(
      vaults.map(async vault => {
        const {
          debtAmount,
          collateralAmount,
          series: {
            baseAsset: { id: artAddress, assetId: baseId },
            fyToken: { maturity },
          },
          collateral: {
            asset: { id: ilkAddress, assetId: ilkId },
          },
        } = vault;

        // get the corresponding art (debt) and ilk (collateral) of the vault
        const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
        const art = baseTokens.find(v => v.address === artAddress.toLowerCase());
        const ilk = baseTokens.find(v => v.address === ilkAddress.toLowerCase());

        if (!art || !ilk) return null;

        // data props
        const collateral = drillBalance(ilk, parseUnits(collateralAmount.toString(), ilk.decimals).toString());
        const debt = drillBalance(art, parseUnits(debtAmount.toString(), art.decimals).toString(), { isDebt: true });
        const tokens = [collateral, debt];
        const balanceUSD = sumBy(tokens, v => v.balanceUSD);
        const collateralizationRatio = `${(debt.balanceUSD === 0
          ? 0
          : (collateral.balanceUSD / Math.abs(debt.balanceUSD)) * 100
        )
          .toFixed(2)
          .toString()}%`;

        const multicall = this.appToolkit.getMulticall(network);
        const cauldron = this.yieldProtocolContractFactory.cauldron({ address: CAULDRON, network });
        const [{ dec: cauldronPairDecimals }, { ratio }] = await Promise.all([
          multicall.wrap(cauldron).debt(baseId, ilkId),
          multicall.wrap(cauldron).spotOracles(baseId, ilkId),
        ]);
        const minCollatRatio = ratio / 10 ** cauldronPairDecimals;
        const minCollateralizationRatio = `${(minCollatRatio * 100).toString()}%`;
        const liqPrice = (debtAmount * minCollatRatio) / collateralAmount;
        const liquidationPrice = `1 ${ilk.symbol}: ${liqPrice.toFixed(2)} ${art.symbol}`;

        // display props
        const displayProps: DisplayProps = {
          label: `Yield Vault`,
          secondaryLabel: `${getLabelFromToken(art)} Debt and ${getLabelFromToken(ilk)} Collateral`,
          tertiaryLabel: formatMaturity(maturity),
          images: [getImagesFromToken(art)[0], getImagesFromToken(ilk)[0]],
        };

        const positionBalance: ContractPositionBalance<YieldVaultContractPositionDataProps> = {
          type: ContractType.POSITION,
          address,
          appId,
          groupId: YIELD_PROTOCOL_DEFINITION.groups.borrow.id,
          network,
          tokens,
          balanceUSD,

          dataProps: {
            collateralizationRatio,
            minCollateralizationRatio,
            liquidationPrice,
          },

          displayProps,
        };

        return positionBalance;
      }),
    );
    return compact(positions);
  }

  private async getLendBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: YIELD_PROTOCOL_DEFINITION.id,
      groupId: YIELD_PROTOCOL_DEFINITION.groups.lend.id,
      network: Network.ARBITRUM_MAINNET,
    });
  }

  private async getPoolBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: YIELD_PROTOCOL_DEFINITION.id,
      groupId: YIELD_PROTOCOL_DEFINITION.groups.pool.id,
      network: Network.ARBITRUM_MAINNET,
    });
  }

  async getBalances(address: string) {
    const [lendBalances, poolBalances, borrowBalances] = await Promise.all([
      this.getLendBalances(address),
      this.getPoolBalances(address),
      this.getBorrowBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      { label: 'Lend', assets: lendBalances },
      { label: 'Pool', assets: poolBalances },
      { label: 'Borrow', assets: borrowBalances },
    ]);
  }
}
