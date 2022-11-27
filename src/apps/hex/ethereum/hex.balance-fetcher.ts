import { Inject } from '@nestjs/common';
import { BigNumber, CallOverrides } from 'ethers';

import { drillBalance } from '~app-toolkit';
import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { isSupplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { HexContractFactory } from '../contracts';
import { HEX_DEFINITION } from '../hex.definition';

const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(HEX_DEFINITION.id, network)
export class EthereumHexBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(HexContractFactory) private readonly hexContractFactory: HexContractFactory,
  ) { }

  async getTotalStakedHex(address: string) {
    return this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
      address,
      appId: HEX_DEFINITION.id,
      groupId: HEX_DEFINITION.groups.stake.id,
      network,
      resolveBalances: async ({ address, contractPosition, multicall }) => {
        // Resolve the staked hex balance using contract
        const hexToken = contractPosition.tokens.find(isSupplied)!;
        // Instantiate contract instance
        const hexContract = this.hexContractFactory.hex(contractPosition);
        // Get current stake count
        const [stakeCount] = await Promise.all([
          multicall.wrap(hexContract).stakeCount(address),
        ]);
        // Return if no active stakes.
        if (stakeCount.isZero()) {
          return [drillBalance(hexToken, "0")];
        }
        // Collect all blockchain calls and execute them together
        let stakeListCalls = [multicall.wrap(hexContract).stakeLists(address, 0)];
        for (let i = 1; i < stakeCount.toNumber(); i++) {
          stakeListCalls.push(multicall.wrap(hexContract).stakeLists(address, i));
        }
        const allStakes = await Promise.all(stakeListCalls);
        // Loop through all stakes created by address and return the sum
        let totalStakedHex = BigNumber.from(0);
        for (let stake of allStakes) {
          totalStakedHex = totalStakedHex.add(stake.stakedHearts);
        }
        return [
          drillBalance(hexToken, totalStakedHex.toString()),
        ];
      },
    });
  }

  async getBalances(address: string) {
    const [totalStakedHex] = await Promise.all([this.getTotalStakedHex(address)]);
    return presentBalanceFetcherResponse([
      {
        label: "Staked HEX",
        assets: totalStakedHex,
      },
    ]);
  }
}
