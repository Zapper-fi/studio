import { Inject } from '@nestjs/common';
import { BigNumber } from 'bignumber.js';
import { range } from 'lodash';

import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { APP_TOOLKIT, IAppToolkit } from '~lib';
import { isSupplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { IlluviumContractFactory, IlluviumCorePool, IlluviumIlvPoolV2 } from '../contracts';
import { ILLUVIUM_DEFINITION } from '../illuvium.definition';

const network = Network.ETHEREUM_MAINNET;
// const LAST_V1_YIELD_CREATED = 1642660625;
// 0: {ticker: 'ILV', name: 'ILV', type: 'core', contractId: '0x7f5f854FfB6b7701540a00C69c4AB2De2B34291D', tokenContractId: '0x767FE9EDC9E0dF98E07454847909b5E959D7ca0E', …}
// 1: {ticker: 'SLP', name: 'ILV/ETH', type: 'core', contractId: '0xe98477bDc16126bB0877c6e3882e3Edd72571Cc2', tokenContractId: '0x6a091a3406E0073C3CD6340122143009aDac0EDa', …}
// 0: {ticker: 'ILV', name: 'ILV', type: 'core', contractId: '0x25121EDDf746c884ddE4619b573A7B10714E2a36', tokenContractId: '0x767FE9EDC9E0dF98E07454847909b5E959D7ca0E', …}
// 1: {ticker: 'SLP', name: 'ILV/ETH', type: 'core', contractId: '0x8B4d8443a0229349A9892D4F7CbE89eF5f843F72', tokenContractId: '0x6a091a3406E0073C3CD6340122143009aDac0EDa', …}

@Register.BalanceFetcher(ILLUVIUM_DEFINITION.id, Network.ETHEREUM_MAINNET)
export class EthereumIlluviumBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(IlluviumContractFactory) private readonly contractFactory: IlluviumContractFactory,
  ) {}

  async getV1StakingBalances(address: string) {
    return this.appToolkit.helpers.singleStakingContractPositionBalanceHelper.getBalances<IlluviumCorePool>({
      address,
      appId: ILLUVIUM_DEFINITION.id,
      groupId: ILLUVIUM_DEFINITION.groups.farm.id,
      network,
      resolveContract: ({ address, network }) => this.contractFactory.illuviumCorePool({ network, address }),
      resolveStakedTokenBalance: async ({ multicall, contract, contractPosition, address }) => {
        const stakedToken = contractPosition.tokens.find(isSupplied)!;

        // For the V1 ILV farm, deduct deposits made after the last V1 yield
        let voidAmountBN = new BigNumber(0);
        if (stakedToken.symbol === 'ILV') {
          const LAST_V1_YIELD_CREATED = 1642660625;
          const depositsLength = Number(await contract.getDepositsLength(address));
          const deposits = await Promise.all(range(0, depositsLength).map(v => contract.getDeposit(address, v)));
          const voidDeposits = deposits.filter(v => v.isYield && Number(v.lockedFrom) > LAST_V1_YIELD_CREATED);
          voidAmountBN = voidDeposits.reduce((acc, v) => acc.plus(v.tokenAmount.toString()), new BigNumber(0));
        }

        const stakedBalance = multicall.wrap(contract).balanceOf(address);
        return new BigNumber(stakedBalance.toString()).minus(voidAmountBN).toString();
      },
      resolveRewardTokenBalances: () => 0,
    });
  }

  async getV2StakingBalances(address: string) {
    return this.appToolkit.helpers.singleStakingContractPositionBalanceHelper.getBalances<IlluviumIlvPoolV2>({
      address,
      appId: ILLUVIUM_DEFINITION.id,
      groupId: ILLUVIUM_DEFINITION.groups.farmV2.id,
      network,
      resolveContract: ({ address, network }) => this.contractFactory.illuviumIlvPoolV2({ network, address }),
      resolveStakedTokenBalance: ({ multicall, contract }) => multicall.wrap(contract).balanceOf(address),
      resolveRewardTokenBalances: ({ multicall, contract }) =>
        multicall
          .wrap(contract)
          .pendingRewards(address)
          .then(v => v.pendingYield),
    });
  }

  async getBalances(address: string) {
    const [v1StakingBalances, v2StakingBalances] = await Promise.all([
      this.getV1StakingBalances(address),
      this.getV2StakingBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Staked',
        assets: [...v1StakingBalances, ...v2StakingBalances],
      },
    ]);
  }
}
