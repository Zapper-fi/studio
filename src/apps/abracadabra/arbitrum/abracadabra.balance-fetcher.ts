import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { SushiSwapBentoBoxContractPositionBalanceHelper } from '~apps/sushiswap-bentobox';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { ABRACADABRA_DEFINITION } from '../abracadabra.definition';
import { AbracadabraContractFactory, PopsicleChef, AbracadabraMspell } from '../contracts';
import { AbracadabraCauldronBalanceHelper } from '../helpers/abracadabra.cauldron.balance-helper';

const appId = ABRACADABRA_DEFINITION.id;
const network = Network.ARBITRUM_MAINNET;

@Register.BalanceFetcher(ABRACADABRA_DEFINITION.id, network)
export class ArbitrumAbracadabraBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(AbracadabraCauldronBalanceHelper)
    private readonly abracadabraCauldronBalanceHelper: AbracadabraCauldronBalanceHelper,
    @Inject(AbracadabraContractFactory) private readonly contractFactory: AbracadabraContractFactory,
    @Inject(SushiSwapBentoBoxContractPositionBalanceHelper)
    private readonly degenboxBalanceHelper: SushiSwapBentoBoxContractPositionBalanceHelper,
  ) {}

  private async getStakedSpellBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      appId: ABRACADABRA_DEFINITION.id,
      groupId: ABRACADABRA_DEFINITION.groups.stakedSpell.id,
      network,
      address,
    });
  }

  private async getDegenboxBalances(address: string) {
    return this.degenboxBalanceHelper.getBalances({
      address,
      network,
      bentoBoxAddress: '0x7c8fef8ea9b1fe46a7689bfb8149341c90431d38',
    });
  }

  private async getCauldronBalances(address: string) {
    return this.abracadabraCauldronBalanceHelper.getBalances({ address, network });
  }

  private async getFarmBalances(address: string) {
    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<PopsicleChef>({
      address,
      appId: ABRACADABRA_DEFINITION.id,
      groupId: ABRACADABRA_DEFINITION.groups.farm.id,
      network,
      resolveChefContract: ({ contractAddress }) =>
        this.contractFactory.popsicleChef({ network, address: contractAddress }),
      resolveStakedTokenBalance: this.appToolkit.helpers.masterChefDefaultStakedBalanceStrategy.build({
        resolveStakedBalance: ({ contract, multicall, contractPosition }) =>
          multicall
            .wrap(contract)
            .userInfo(contractPosition.dataProps.poolIndex, address)
            .then(v => v.amount),
      }),
      resolveClaimableTokenBalances: this.appToolkit.helpers.masterChefDefaultClaimableBalanceStrategy.build({
        resolveClaimableBalance: ({ multicall, contract, contractPosition, address }) =>
          multicall.wrap(contract).pendingIce(contractPosition.dataProps.poolIndex, address),
      }),
    });
  }

  async getBalances(address: string) {
    const [stakedSpellBalances, cauldronBalances, farmBalances, mspellBalances, degenboxBalances] = await Promise.all([
      this.getStakedSpellBalances(address),
      this.getCauldronBalances(address),
      this.getFarmBalances(address),
      this.getMspellBalance(address),
      this.getDegenboxBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Staked SPELL',
        assets: stakedSpellBalances,
      },
      {
        label: 'Cauldrons',
        assets: cauldronBalances,
      },
      {
        label: 'Farms',
        assets: farmBalances,
      },
      {
        label: 'mSPELL',
        assets: mspellBalances,
      },
      {
        label: 'Abracadabra Degenbox',
        assets: degenboxBalances,
      },
    ]);
  }
  private async getMspellBalance(address: string) {
    return this.appToolkit.helpers.singleStakingContractPositionBalanceHelper.getBalances<AbracadabraMspell>({
      address,
      appId,
      network,
      groupId: ABRACADABRA_DEFINITION.groups.mSpell.id,
      resolveContract: opts => this.contractFactory.abracadabraMspell(opts),
      resolveStakedTokenBalance: ({ multicall, contract }) => {
        return multicall
          .wrap(contract)
          .userInfo(address)
          .then(v => v[0]);
      },
      resolveRewardTokenBalances: ({ multicall, contract }) => {
        return multicall.wrap(contract).pendingReward(address);
      },
    });
  }
}
