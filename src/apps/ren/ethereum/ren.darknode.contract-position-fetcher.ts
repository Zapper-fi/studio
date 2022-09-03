import { Inject, Injectable } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { compact, groupBy, sumBy, values } from 'lodash';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { MetaType } from '~position/position.interface';
import { isClaimable, isSupplied } from '~position/position.utils';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { GetDisplayPropsParams } from '~position/template/contract-position.template.types';
import { Network } from '~types';

import { RenApiClient } from '../common/ren.api.client';
import { RenContractFactory, RenDarknodeRegistry } from '../contracts';
import { REN_DEFINITION } from '../ren.definition';

@Injectable()
export class EthereumRenDarknodeContractPositionFetcher extends ContractPositionTemplatePositionFetcher<RenDarknodeRegistry> {
  appId = REN_DEFINITION.id;
  groupId = REN_DEFINITION.groups.darknode.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'Darknodes';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(RenContractFactory) protected readonly contractFactory: RenContractFactory,
    @Inject(RenApiClient) protected readonly apiClient: RenApiClient,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.renDarknodeRegistry({ address, network: this.network });
  }

  async getDefinitions() {
    return [{ address: '0x2d7b6c95afeffa50c068d50f89c5c0014e054f0a' }];
  }

  async getTokenDefinitions() {
    const { assets } = await this.apiClient.getDarknodeAssets();
    const claimable = [ZERO_ADDRESS, ...assets.map(v => v.tokenAddress)];

    return [
      { address: '0x408e41876cccdc0f92210600ef50372656052a38', metaType: MetaType.SUPPLIED },
      ...claimable.map(address => ({ address, metaType: MetaType.CLAIMABLE })),
    ];
  }

  async getLabel(params: GetDisplayPropsParams<RenDarknodeRegistry>): Promise<string> {
    const suppliedToken = params.contractPosition.tokens[0];
    return `${suppliedToken.symbol} in Darknodes`;
  }

  async getTokenBalancesPerPosition() {
    return [];
  }

  async getBalances(address: string) {
    const { darknodes = [] } = await this.apiClient.getDarknodeBalance(address);
    if (darknodes.length === 0) return [];

    const contractPositions = await this.appToolkit.getAppContractPositions({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });

    const darknodePosition = contractPositions[0];
    if (!darknodePosition) return [];

    const supplied = darknodePosition.tokens.find(isSupplied)!;
    const claimable = darknodePosition.tokens.filter(isClaimable);

    // Resolve deposited balance
    const balanceRaw = darknodes
      .filter(x => +x.registeredAt > 0)
      .reduce((sum, x) => new BigNumber(x.bond).plus(sum), new BigNumber(0));

    // Resolve ungrouped claimable balances
    const ungroupedClaimable = (darknodes ?? [])
      .filter(x => +x.registeredAt > 0)
      .flatMap(v => v.balances)
      .map(balance => {
        const token = claimable.find(p => balance.symbol === p.symbol);
        return token ? drillBalance(token, balance.amount) : null;
      });

    // Aggregate claimable balances
    const groupedClaimable = values(groupBy(compact(ungroupedClaimable), v => v.address));

    const suppliedBalances = drillBalance(supplied, balanceRaw.toFixed(0));
    const claimableBalances = groupedClaimable.map(v => {
      const totalBalanceRaw = v.reduce((acc, t) => acc.plus(t.balanceRaw), new BigNumber(0)).toFixed(0);
      return drillBalance(v[0], totalBalanceRaw);
    });

    const tokens = [suppliedBalances, ...claimableBalances];
    const balanceUSD = sumBy(tokens, t => t.balanceUSD);

    const balance: ContractPositionBalance = { ...darknodePosition, tokens, balanceUSD };
    return [balance];
  }
}
