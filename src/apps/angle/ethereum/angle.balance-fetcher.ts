import { Inject } from '@nestjs/common';
import { utils, BigNumber } from 'ethers';
import { compact, sumBy } from 'lodash';

import { drillBalance } from '~app-toolkit';
import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { CurveVotingEscrowContractPositionBalanceHelper } from '~apps/curve/helpers/curve.voting-escrow.contract-position-balance-helper';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { isBorrowed, isSupplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { ANGLE_DEFINITION } from '../angle.definition';
import { AngleContractFactory, AngleLiquidityGauge, AngleVeangle } from '../contracts';
import { AngleApiHelper } from '../helpers/angle.api';

const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(ANGLE_DEFINITION.id, network)
export class EthereumAngleBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(AngleContractFactory) private readonly angleContractFactory: AngleContractFactory,
    @Inject(AngleApiHelper)
    private readonly angleApiHelper: AngleApiHelper,
    @Inject(CurveVotingEscrowContractPositionBalanceHelper)
    private readonly curveVotingEscrowContractPositionBalanceHelper: CurveVotingEscrowContractPositionBalanceHelper,
  ) {}

  async getVeAngleTokenBalances(address: string) {
    return this.curveVotingEscrowContractPositionBalanceHelper.getBalances<AngleVeangle, AngleLiquidityGauge>({
      address,
      network,
      appId: ANGLE_DEFINITION.id,
      groupId: ANGLE_DEFINITION.groups.veangle.id,
      resolveContract: ({ address }) => this.angleContractFactory.angleVeangle({ network, address }),
      resolveRewardContract: ({ address }) => this.angleContractFactory.angleLiquidityGauge({ address, network }),
      resolveLockedTokenBalance: ({ contract, multicall }) =>
        multicall
          .wrap(contract)
          .locked(address)
          .then(v => v.amount),
      resolveRewardTokenBalance: async () => {
        const { rewardsData } = await this.angleApiHelper.getRewardsData(address);
        return rewardsData.totalClaimable;
      },
    });
  }

  async getSanTokenBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: ANGLE_DEFINITION.id,
      groupId: ANGLE_DEFINITION.groups.santoken.id,
      network,
    });
  }

  async getPerpetuals(address: string) {
    const contractPositions = await this.appToolkit.getAppContractPositions({
      appId: ANGLE_DEFINITION.id,
      groupIds: [ANGLE_DEFINITION.groups.perpetuals.id],
      network,
    });

    const { perpetuals } = await this.angleApiHelper.getUserPerpetuals(address);

    const balances = perpetuals.map(perp => {
      const contractPosition = contractPositions.find(
        v => v.address.toLowerCase() === perp.perpetualManager.toLowerCase(),
      );
      if (!contractPosition) return null;

      const collateralToken = contractPosition!.tokens.find(isSupplied)!;

      const positionSize = BigNumber.from(perp.committedAmount);

      const tokens = [drillBalance(collateralToken, positionSize.toString())];
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

    const vaults = Object.values(await this.angleApiHelper.getUserVaults(address));

    const balances = vaults.map(vault => {
      const contractPosition = contractPositions.find(v => v.address === vault.address.toLowerCase());
      if (!contractPosition) return null;

      const collateralToken = contractPosition!.tokens.find(isSupplied)!;
      const borrowedToken = contractPosition!.tokens.find(isBorrowed)!;

      const collateral = vault.collateralAmount / 10 ** collateralToken.decimals;
      const debt = vault.debt / 10 ** borrowedToken.decimals;

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
    const [veAngleTokenBalances, sanTokenBalances, perpetuals, vaults] = await Promise.all([
      this.getVeAngleTokenBalances(address),
      this.getSanTokenBalances(address),
      this.getPerpetuals(address),
      this.getVaults(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'veANGLE',
        assets: veAngleTokenBalances,
      },
      {
        label: 'sanTokens',
        assets: sanTokenBalances,
      },
      {
        label: 'Vaults',
        assets: vaults,
      },
      {
        label: 'Perpetuals',
        assets: perpetuals,
        meta: [
          {
            label: 'Position size (ETH)',
            value: sumBy(perpetuals, perp => perp.balanceUSD),
            type: 'number',
          },
        ],
      },
    ]);
  }
}
