import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import {
  OlympusBondV1ContractPositionBalanceHelper,
  OlympusContractFactory,
  OlympusV1BondDepository,
} from '~apps/olympus';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { JpegdContractFactory, JpegdLpFarm } from '../contracts';
import { JPEGD_DEFINITION } from '../jpegd.definition';

const appId = JPEGD_DEFINITION.id;
const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(appId, network)
export class EthereumJpegdBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(JpegdContractFactory) private readonly jpegdContractFactory: JpegdContractFactory,
    @Inject(OlympusContractFactory) private readonly olympusContractFactory: OlympusContractFactory,
    @Inject(OlympusBondV1ContractPositionBalanceHelper)
    private readonly olympusContractPositionBalanceHelper: OlympusBondV1ContractPositionBalanceHelper,
  ) {}

  async getPoolBalances(address: string) {
    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<JpegdLpFarm>({
      address,
      appId,
      groupId: JPEGD_DEFINITION.groups.pool.id,
      network,
      resolveChefContract: ({ contractAddress }) =>
        this.jpegdContractFactory.jpegdLpFarm({ network, address: contractAddress }),
      resolveStakedTokenBalance: this.appToolkit.helpers.masterChefDefaultStakedBalanceStrategy.build({
        resolveStakedBalance: ({ contract, multicall, contractPosition }) =>
          multicall
            .wrap(contract)
            .userInfo(contractPosition.dataProps.poolIndex, address)
            .then(v => v.amount),
      }),
      resolveClaimableTokenBalances: this.appToolkit.helpers.masterChefDefaultClaimableBalanceStrategy.build({
        resolveClaimableBalance: ({ multicall, contract, contractPosition, address }) =>
          multicall.wrap(contract).pendingReward(contractPosition.dataProps.poolIndex, address),
      }),
    });
  }

  private async getBondBalances(address: string) {
    return this.olympusContractPositionBalanceHelper.getBalances<OlympusV1BondDepository>({
      network,
      appId,
      address,
      groupId: JPEGD_DEFINITION.groups.bond.id,
      resolveDepositoryContract: ({ depositoryAddress: address }) =>
        this.olympusContractFactory.olympusV1BondDepository({ network, address }),
      resolveClaimablePayout: ({ multicall, contract, address }) => multicall.wrap(contract).pendingPayoutFor(address),
      resolveTotalPayout: ({ multicall, contract, address }) =>
        multicall
          .wrap(contract)
          .bondInfo(address)
          .then(v => v.payout),
    });
  }

  async getBalances(address: string) {
    const [poolBalances, bondBalances] = await Promise.all([
      this.getPoolBalances(address),
      this.getBondBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Pools',
        assets: poolBalances,
      },
      {
        label: 'Bonds',
        assets: bondBalances,
      },
    ]);
  }
}
