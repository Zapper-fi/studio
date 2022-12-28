import { Inject, NotImplementedException } from '@nestjs/common';
import { compact, sumBy } from 'lodash';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { DefaultDataProps } from '~position/display.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { MetaType } from '~position/position.interface';
import { claimable, locked } from '~position/position.utils';
import { GetDisplayPropsParams, GetTokenDefinitionsParams } from '~position/template/contract-position.template.types';
import { CustomContractPositionTemplatePositionFetcher } from '~position/template/custom-contract-position.template.position-fetcher';

import { LlamapayStreamApiClient } from '../common/llamapay.stream.api-client';
import { LlamapayContractFactory, LlamapayVestingEscrow } from '../contracts';

export type LlamapayVestingEscrowContractPositionDefinition = {
  address: string;
  tokenAddress: string;
};

@PositionTemplate()
export class EthereumLlamapayVestingEscrowContractPositionFetcher extends CustomContractPositionTemplatePositionFetcher<
  LlamapayVestingEscrow,
  DefaultDataProps,
  LlamapayVestingEscrowContractPositionDefinition
> {
  groupLabel = 'Vesting Escrow';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(LlamapayContractFactory) protected readonly contractFactory: LlamapayContractFactory,
    @Inject(LlamapayStreamApiClient) protected readonly apiClient: LlamapayStreamApiClient,
  ) {
    super(appToolkit);
  }

  async getDefinitions() {
    return this.apiClient.getTokens();
  }

  getContract(address: string): LlamapayVestingEscrow {
    return this.contractFactory.llamapayVestingEscrow({ address, network: this.network });
  }

  async getTokenDefinitions({
    definition,
  }: GetTokenDefinitionsParams<LlamapayVestingEscrow, LlamapayVestingEscrowContractPositionDefinition>) {
    return [
      {
        address: definition.tokenAddress,
        metaType: MetaType.LOCKED,
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
    const multicall = this.appToolkit.getMulticall(this.network);
    const vestingEscrows = await this.apiClient.getVestingEscrows(address, this.network);
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
        const [lockedBalanceRaw, claimableBalanceRaw] = await Promise.all([llamapay.locked(), llamapay.unclaimed()]);

        const token = tokenDependencies.find(t => t.address === vestingEscrow.token.id);
        if (!token) return null;

        const tokenBalances = [
          drillBalance(locked(token), lockedBalanceRaw.toString()),
          drillBalance(claimable(token), claimableBalanceRaw.toString()),
        ];

        const balanceUSD = sumBy(tokenBalances, v => v.balanceUSD);

        const position: ContractPositionBalance = {
          type: ContractType.POSITION,
          address: vestingEscrow.id,
          network: this.network,
          appId: this.appId,
          groupId: this.groupId,
          tokens: tokenBalances,
          balanceUSD: balanceUSD,

          dataProps: {},

          displayProps: {
            label: `Vesting ${token.symbol} on LlamaPay`,
            secondaryLabel: buildDollarDisplayItem(token.price),
            images: getImagesFromToken(token),
          },
        };

        return position;
      }),
    );
    return compact(positions);
  }
}
