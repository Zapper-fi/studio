import { Inject } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { compact, groupBy, sumBy, values } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { drillBalance } from '~app-toolkit/helpers/drill-balance.helper';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { MetaType } from '~position/position.interface';
import { isClaimable, isSupplied } from '~position/position.utils';
import { GetDisplayPropsParams } from '~position/template/contract-position.template.types';
import { CustomContractPositionTemplatePositionFetcher } from '~position/template/custom-contract-position.template.position-fetcher';

import { RenApiClient } from '../common/ren.api.client';
import { RenViemContractFactory } from '../contracts';
import { RenDarknodeRegistry } from '../contracts/viem';

@PositionTemplate()
export class EthereumRenDarknodeContractPositionFetcher extends CustomContractPositionTemplatePositionFetcher<RenDarknodeRegistry> {
  groupLabel = 'Darknodes';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(RenViemContractFactory) protected readonly contractFactory: RenViemContractFactory,
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
      {
        metaType: MetaType.SUPPLIED,
        address: '0x408e41876cccdc0f92210600ef50372656052a38',
        network: this.network,
      },
      ...claimable.map(claimableTokenAddress => ({
        metaType: MetaType.CLAIMABLE,
        address: claimableTokenAddress,
        network: this.network,
      })),
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
