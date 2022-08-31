import { Inject } from '@nestjs/common';

import { drillBalance } from '~app-toolkit';
import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { isSupplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { LyraAvalonContractFactory, OptionToken, LyraLpStaking } from '../contracts';
import { LYRA_AVALON_DEFINITION } from '../lyra-avalon.definition';

import { AaveSafetyModuleClaimableBalanceHelper } from './helpers/aave-safety.claimable.balance-helper';
import { OPTION_TYPES, STAKING_ADDRESS } from './helpers/consts';
import { LyraAvalonOptionContractPositionDataProps } from './lyra-avalon.options.contract-position-fetcher';

const appId = LYRA_AVALON_DEFINITION.id;
const network = Network.OPTIMISM_MAINNET;

@Register.BalanceFetcher(LYRA_AVALON_DEFINITION.id, network)
export class OptimismLyraAvalonBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(LyraAvalonContractFactory) private readonly contractFactory: LyraAvalonContractFactory,
    @Inject(AaveSafetyModuleClaimableBalanceHelper)
    private readonly claimableBalanceHelper: AaveSafetyModuleClaimableBalanceHelper,
  ) {}

  async getStakingBalances(address: string) {
    return this.appToolkit.helpers.singleStakingContractPositionBalanceHelper.getBalances<LyraLpStaking>({
      address,
      appId,
      groupId: LYRA_AVALON_DEFINITION.groups.staking.id,
      network,
      resolveContract: ({ address, network }) => this.contractFactory.lyraLpStaking({ address, network }),
      resolveStakedTokenBalance: ({ contract, address, multicall }) => multicall.wrap(contract).balanceOf(address),
      resolveRewardTokenBalances: ({ contract, address, multicall }) => multicall.wrap(contract).earned(address),
    });
  }

  async getVotedEscrowBalances(address: string) {
    return await this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId,
      groupId: LYRA_AVALON_DEFINITION.groups.ve.id,
      network,
    });
  }

  async getClaimableBalances(address: string) {
    return this.claimableBalanceHelper.getBalances(address, {
      network,
      appId,
      groupId: LYRA_AVALON_DEFINITION.groups.claimable.id,
      dependencies: [{ appId, groupIds: [LYRA_AVALON_DEFINITION.groups.staking.id], network }],
      resolveContract: ({ address }) => this.contractFactory.lyraStaking({ address, network }),
      resolveVaultAddresses: () => [STAKING_ADDRESS],
    });
  }

  async getPoolBalances(address: string) {
    return await this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId,
      groupId: LYRA_AVALON_DEFINITION.groups.pool.id,
      network,
    });
  }

  async getOptionsBalances(address: string) {
    const markets: Record<string, OptionToken.OptionPositionStructOutput[]> = {};
    const multicall = this.appToolkit.getMulticall(network);

    return this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
      address,
      appId,
      groupId: LYRA_AVALON_DEFINITION.groups.options.id,
      network,
      resolveBalances: async ({
        contractPosition,
      }: {
        contractPosition: ContractPosition<LyraAvalonOptionContractPositionDataProps>;
      }) => {
        // Extract information from contract position
        const { strikeId, optionType, marketAddress, quoteAddress, tokenAddress, callPrice, putPrice } =
          contractPosition.dataProps;
        const collateralToken = contractPosition.tokens.find(isSupplied)!;
        const quoteToken = contractPosition.tokens.find(token => token.address === quoteAddress)!;

        // Pull user positions for the relevant market
        if (!markets[marketAddress]) {
          const contract = this.contractFactory.optionToken({ address: tokenAddress, network });
          markets[marketAddress] = await multicall.wrap(contract).getOwnerPositions(address);
        }

        // Find matching user position for contract position
        const userPosition = markets[marketAddress].find(
          position => Number(position.strikeId) === strikeId && position.optionType === optionType,
        );
        if (!userPosition) return [];

        // Determine price of the contract position strike.
        // Note: may not be totally accurate
        const price = OPTION_TYPES[optionType].includes('Call') ? callPrice : putPrice;
        const balance = ((Number(price) * Number(userPosition.amount)) / 10 ** quoteToken.decimals).toString();

        if (Number(optionType) >= 2) {
          // Short Option
          const debt = drillBalance(quoteToken, balance, { isDebt: true });
          const collateral = drillBalance(collateralToken, userPosition.collateral.toString());
          return [debt, collateral];
        }
        // Long Option
        return [drillBalance(quoteToken, balance)];
      },
    });
  }

  async getBalances(address: string) {
    const [stakingBalances, votedEscrowBalances, claimableBalances, tokenBalances, optionsBalances] = await Promise.all(
      [
        this.getStakingBalances(address),
        this.getVotedEscrowBalances(address),
        this.getClaimableBalances(address),
        this.getPoolBalances(address),
        this.getOptionsBalances(address),
      ],
    );

    return presentBalanceFetcherResponse([
      {
        label: 'Staking',
        assets: stakingBalances,
      },
      {
        label: 'VotedEscrow',
        assets: votedEscrowBalances,
      },
      {
        label: 'Pools',
        assets: tokenBalances,
      },
      {
        label: 'Options',
        assets: optionsBalances,
      },
      {
        label: 'Rewards',
        assets: claimableBalances,
      },
    ]);
  }
}
