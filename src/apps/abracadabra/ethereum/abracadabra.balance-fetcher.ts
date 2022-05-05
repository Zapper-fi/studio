import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { ABRACADABRA_DEFINITION } from '../abracadabra.definition';
import { AbracadabraContractFactory, PopsicleChef, AbracadabraMspell } from '../contracts';
import { AbracadabraCauldronBalanceHelper } from '../helpers/abracadabra.cauldron.balance-helper';

const appId = ABRACADABRA_DEFINITION.id;
const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(ABRACADABRA_DEFINITION.id, network)
export class EthereumAbracadabraBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(AbracadabraCauldronBalanceHelper)
    private readonly abracadabraCauldronBalanceHelper: AbracadabraCauldronBalanceHelper,
    @Inject(AbracadabraContractFactory) private readonly contractFactory: AbracadabraContractFactory,
  ) {}

  private async getStakedSpellBalances(address: string) {
    return this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      appId: ABRACADABRA_DEFINITION.id,
      groupId: ABRACADABRA_DEFINITION.groups.stakedSpell.id,
      network,
      address,
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
    const [stakedSpellBalances, cauldronBalances, farmBalances, mspellBalances] = await Promise.all([
      this.getStakedSpellBalances(address),
      this.getCauldronBalances(address),
      this.getFarmBalances(address),
      this.getMspellBalance(address),
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
