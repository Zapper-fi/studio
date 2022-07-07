import { Inject } from '@nestjs/common';
import { utils, BigNumber } from 'ethers';
import { compact, sumBy } from 'lodash';

import { drillBalance } from '~app-toolkit';
import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { isBorrowed, isSupplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { ANGLE_DEFINITION } from '../angle.definition';
import { AngleContractFactory } from '../contracts';
import { callAngleApi } from '../helpers/angle.api';

const network = Network.ETHEREUM_MAINNET;

type TVault = {
  address: string;
  collateral: string;
  collateralAmount: number;
  collateralRatio: number;
  debt: number;
  debtString: string;
  id: number;
  liquidationPrice: number;
  rate: number;
  stablecoin: string;
  symbol: string;
};

type TPerpetual = {
  perpetualID: string;
  owner: string;
  decimals: string;
  margin: string;
  committedAmount: string;
  entryRate: string;
  perpetualManager: string;
  stableAddress: string;
  collatAddress: string;
  stableName: string;
  collatName: string;
  openingTimestamp: string;
  lastUpdateTimestamp: string;
  openingBlockNumber: string;
  lastUpdateBlockNumber: string;
  status: string;
  claimable: number;
};

@Register.BalanceFetcher(ANGLE_DEFINITION.id, network)
export class EthereumAngleBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(AngleContractFactory) private readonly angleContractFactory: AngleContractFactory,
  ) {}

  async getVeAngleTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: ANGLE_DEFINITION.id,
      groupId: ANGLE_DEFINITION.groups.veangle.id,
      network: Network.ETHEREUM_MAINNET,
    });
  }

  async getSanUSDCClaimableBalance(address: string) {
    const { rewardsData } = await callAngleApi<{ rewardsData: { totalClaimable: number } }>('dao', {
      chainId: 1,
      user: address,
    });
    const contractPositions = await this.appToolkit.getAppTokenPositions({
      appId: ANGLE_DEFINITION.id,
      groupIds: [ANGLE_DEFINITION.groups.santoken.id],
      network,
    });

    const contractPosition = contractPositions.find(v => v.symbol == 'sanUSDC_EUR')!;
    return [drillBalance(contractPosition, rewardsData.totalClaimable.toString())];
  }

  async getSanTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: ANGLE_DEFINITION.id,
      groupId: ANGLE_DEFINITION.groups.santoken.id,
      network: Network.ETHEREUM_MAINNET,
    });
  }

  async getPerpetuals(address: string) {
    const contractPositions = await this.appToolkit.getAppContractPositions({
      appId: ANGLE_DEFINITION.id,
      groupIds: [ANGLE_DEFINITION.groups.perpetuals.id],
      network,
    });

    const { perpetuals } = await callAngleApi<{ perpetuals: TPerpetual[] }>('perpetuals', {
      chainId: 1,
      user: address,
    });

    const balances = perpetuals.map(perp => {
      const contractPosition = contractPositions.find(
        v => v.address.toLowerCase() === perp.perpetualManager.toLowerCase(),
      );
      if (!contractPosition) return null;

      const collateralToken = contractPosition!.tokens.find(isSupplied)!;

      const positionSize = BigNumber.from(perp.committedAmount);

      const tokens = [drillBalance(collateralToken, utils.formatUnits(positionSize, collateralToken.decimals))];
      const balance = positionSize.mul(utils.parseEther(collateralToken.price.toString())).div(utils.parseEther('1'));
      const balanceUSD = Number(utils.formatUnits(balance, collateralToken.decimals));

      return {
        ...contractPosition,
        balanceUSD,
        tokens,
      };
    });

    return compact(balances);
  }

  async getVaults(address: string) {
    const contractPositions = await this.appToolkit.getAppContractPositions({
      appId: ANGLE_DEFINITION.id,
      groupIds: [ANGLE_DEFINITION.groups.vaults.id],
      network,
    });

    const vaults = Object.values(
      await callAngleApi<Record<string, TVault>>('vaults', {
        chainId: 1,
        user: address,
      }),
    );

    const balances = vaults.map(vault => {
      const contractPosition = contractPositions.find(v => v.address.toLowerCase() === vault.address.toLowerCase());
      if (!contractPosition) return null;

      const collateralToken = contractPosition!.tokens.find(isSupplied)!;
      const borrowedToken = contractPosition!.tokens.find(isBorrowed)!;

      const collateral = utils.parseUnits(vault.collateralAmount.toString(), collateralToken.decimals);
      const debt = utils.parseUnits(vault.debt.toString(), borrowedToken.decimals);

      const tokens = [
        drillBalance(collateralToken, collateral.toString()),
        drillBalance(borrowedToken, debt.toString(), { isDebt: true }),
      ];

      const balanceUSD = sumBy(tokens, t => t.balanceUSD);

      return {
        ...contractPosition,
        balanceUSD,
        tokens,
      };
    });

    return compact(balances);
  }

  async getBalances(address: string) {
    const [veAngleTokenBalances, sanTokenBalances, perpetuals, vaults, sanUSDCClaimableBalance] = await Promise.all([
      this.getVeAngleTokenBalances(address),
      this.getSanTokenBalances(address),
      this.getPerpetuals(address),
      this.getVaults(address),
      this.getSanUSDCClaimableBalance(address),
    ]);

    return presentBalanceFetcherResponse([
      { label: 'veANGLE', assets: veAngleTokenBalances },
      { label: 'sanUSDC_EUR', assets: sanUSDCClaimableBalance },
      { label: 'sanTokens', assets: sanTokenBalances },

      { label: 'Vaults', assets: vaults },

      {
        label: 'Perpetuals',
        assets: perpetuals,
        meta: [
          {
            label: 'Position size (ETH)',
            value: sumBy(perpetuals, perp => perp.balanceUSD),
            type: 'number',
          },
          // {
          //   label: 'Margin (ETH)',
          //   value: 10,
          //   type: 'number',
          // },
          // {
          //   label: 'PnL',
          //   value: 10,
          //   type: 'dollar',
          // },
          // {
          //   label: 'Liquidation price',
          //   value: 10,
          //   type: 'dollar',
          // },
        ],
      },
    ]);
  }
}
