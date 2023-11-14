import { Inject, NotImplementedException } from '@nestjs/common';
import { compact, sumBy } from 'lodash';
import moment, { duration, unix } from 'moment';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { drillBalance } from '~app-toolkit/helpers/drill-balance.helper';
import {
  buildDollarDisplayItem,
  buildNumberDisplayItem,
  buildStringDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { DefaultDataProps } from '~position/display.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { MetaType } from '~position/position.interface';
import { claimable, locked } from '~position/position.utils';
import { GetDisplayPropsParams, GetTokenDefinitionsParams } from '~position/template/contract-position.template.types';
import { CustomContractPositionTemplatePositionFetcher } from '~position/template/custom-contract-position.template.position-fetcher';

import { LlamapayStreamApiClient } from '../common/llamapay.stream.api-client';
import { LlamapayViemContractFactory } from '../contracts';
import { LlamapayVestingEscrow } from '../contracts/viem';

export type LlamapayVestingEscrowContractPositionDefinition = {
  address: string;
  tokenAddress: string;
};

export abstract class LlamapayVestingEscrowContractPositionFetcher extends CustomContractPositionTemplatePositionFetcher<
  LlamapayVestingEscrow,
  DefaultDataProps,
  LlamapayVestingEscrowContractPositionDefinition
> {
  groupLabel = 'Vesting Escrow';
  abstract subgraph: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(LlamapayViemContractFactory) protected readonly contractFactory: LlamapayViemContractFactory,
    @Inject(LlamapayStreamApiClient) protected readonly apiClient: LlamapayStreamApiClient,
  ) {
    super(appToolkit);
  }

  async getDefinitions() {
    return this.apiClient.getTokens(this.subgraph);
  }

  getContract(address: string) {
    return this.contractFactory.llamapayVestingEscrow({ address, network: this.network });
  }

  async getTokenDefinitions({
    definition,
  }: GetTokenDefinitionsParams<LlamapayVestingEscrow, LlamapayVestingEscrowContractPositionDefinition>) {
    return [
      {
        address: definition.tokenAddress,
        metaType: MetaType.VESTING,
        network: this.network,
      },
      {
        address: definition.tokenAddress,
        metaType: MetaType.CLAIMABLE,
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<LlamapayVestingEscrow>) {
    return `${getLabelFromToken(contractPosition.tokens[0])} Llamapay Vesting Escrow`;
  }

  getTokenBalancesPerPosition(): never {
    throw new NotImplementedException();
  }

  async getBalances(address: string) {
    const multicall = this.appToolkit.getViemMulticall(this.network);
    const vestingEscrows = await this.apiClient.getVestingEscrows(address, this.subgraph);
    if (vestingEscrows.length === 0) return [];

    const tokenLoader = this.appToolkit.getTokenDependencySelector({
      tags: { network: this.network, context: this.appId },
    });

    const underlyingAddresses = vestingEscrows.map(vestingEscrow => ({
      network: this.network,
      address: vestingEscrow.token.id,
    }));

    const tokenDependencies = await tokenLoader.getMany(underlyingAddresses).then(deps => compact(deps));

    const positions = await Promise.all(
      vestingEscrows.map(async vestingEscrow => {
        const llamapayContract = this.contractFactory.llamapayVestingEscrow({
          address: vestingEscrow.id.toLowerCase(),
          network: this.network,
        });

        const llamapay = multicall.wrap(llamapayContract);

        const [disabledAt, endTime, cliff] = await Promise.all([
          llamapay.read.disabled_at(),
          llamapay.read.end_time(),
          llamapay.read.cliff_length(),
        ]);

        const lockedBalanceRaw = Number(disabledAt) > moment().unix() ? await llamapay.read.locked() : 0;
        const claimableBalanceRaw = await llamapay.read.unclaimed();

        const token = tokenDependencies.find(t => t.address === vestingEscrow.token.id);
        if (!token) return null;

        const tokenBalances = [
          drillBalance(locked(token), lockedBalanceRaw.toString()),
          drillBalance(claimable(token), claimableBalanceRaw.toString()),
        ];

        const balanceUSD = sumBy(tokenBalances, v => v.balanceUSD);

        const formattedEndTime = unix(Number(endTime)).format('LL');
        const formattedCliff = Number(cliff) / duration(1, 'day').asSeconds();

        const statsItems = [
          {
            label: 'End Time',
            value: buildStringDisplayItem(formattedEndTime),
          },
          {
            label: 'Cliff length (in days)',
            value: buildNumberDisplayItem(formattedCliff),
          },
        ];

        const position: ContractPositionBalance = {
          type: ContractType.POSITION,
          address: vestingEscrow.id,
          network: this.network,
          appId: this.appId,
          groupId: this.groupId,
          tokens: tokenBalances,
          balanceUSD: balanceUSD,

          dataProps: {
            endTime: Number(endTime),
            cliff: Number(cliff),
          },

          displayProps: {
            label: `Vesting ${token.symbol} on LlamaPay`,
            secondaryLabel: buildDollarDisplayItem(token.price),
            images: getImagesFromToken(token),
            statsItems,
          },
        };

        return position;
      }),
    );
    return compact(positions);
  }
}
