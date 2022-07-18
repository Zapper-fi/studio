import { Inject } from '@nestjs/common';
import { drillBalance } from '~app-toolkit';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';
import { RocketPoolContractFactory } from '../contracts';
import { RocketPoolRethBalanceHelper } from '../helpers/rocket-pool.reth.balance-helper';

import { ROCKET_POOL_DEFINITION } from '../rocket-pool.definition';

const appId = ROCKET_POOL_DEFINITION.id;
const rplGroupId = ROCKET_POOL_DEFINITION.groups.rpl.id;
const network = Network.ETHEREUM_MAINNET;

const rocketTokenRPLAddress = '0xD33526068D116cE69F19A9ee46F0bd304F21A51f';
const rocketNodeStakingAddress = '0x3019227b2b8493e45Bf5d25302139c9a2713BF15';
const rocketDAONodeTrustedAddress = '0xb8e783882b11Ff4f6Cef3C501EA0f4b960152cc9';

@Register.BalanceFetcher(ROCKET_POOL_DEFINITION.id, network)
export class EthereumRocketPoolBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(RocketPoolContractFactory) private readonly rocketPoolContractFactory: RocketPoolContractFactory,
    @Inject(RocketPoolRethBalanceHelper) private readonly rocketPoolRethBalanceHelper: RocketPoolRethBalanceHelper,
  ) {}

  async getBalances(address: string) {
    const rpl = (
      await this.appToolkit.getAppTokenPositions({
        appId,
        network,
        groupIds: [rplGroupId],
      })
    ).find(token => token.address == rocketTokenRPLAddress)!;

    return presentBalanceFetcherResponse([
      {
        label: 'Rocket Pool Protocol Token',
        assets: [
          ...(await this.getWalletBalances(address)),
          await this.getStakedBalance(address, rpl),
          await this.getOracleDdaoBondBalance(address, rpl),
        ],
      },
      ...(await this.rocketPoolRethBalanceHelper.getBalances(address)),
    ]);
  }

  async getWalletBalances(address: string) {
    return await this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId: ROCKET_POOL_DEFINITION.id,
      groupId: ROCKET_POOL_DEFINITION.groups.rpl.id,
      network: Network.ETHEREUM_MAINNET,
    });
  }

  async getStakedBalance(address: string, token: AppTokenPosition) {
    const contract = this.rocketPoolContractFactory.rocketNodeStaking({ address: rocketNodeStakingAddress, network });
    const balanceRaw = (await contract.getNodeRPLStake(address)).toString();
    const tokenBalance = drillBalance(token as AppTokenPosition, balanceRaw);
    return {
      ...tokenBalance,
      displayProps: {
        ...tokenBalance.displayProps,
        label: 'RPL Staked',
      },
    };
  }

  async getOracleDdaoBondBalance(address: string, token: AppTokenPosition) {
    const contract = this.rocketPoolContractFactory.rocketDaoNodeTrusted({
      address: rocketDAONodeTrustedAddress,
      network,
    });
    const balanceRaw = (await contract.getMemberRPLBondAmount(address)).toString();
    const tokenBalance = drillBalance(token as AppTokenPosition, balanceRaw);
    return {
      ...tokenBalance,
      displayProps: {
        ...tokenBalance.displayProps,
        label: 'Oracle DAO Bond',
      },
    };
  }
}
