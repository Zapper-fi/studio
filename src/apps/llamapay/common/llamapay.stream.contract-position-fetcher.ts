import { Inject, NotImplementedException } from '@nestjs/common';
import { compact } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { drillBalance } from '~app-toolkit/helpers/drill-balance.helper';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { isViemMulticallUnderlyingError } from '~multicall/errors';
import { ContractType } from '~position/contract.interface';
import { DefaultDataProps } from '~position/display.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { MetaType } from '~position/position.interface';
import { GetDisplayPropsParams, GetTokenDefinitionsParams } from '~position/template/contract-position.template.types';
import { CustomContractPositionTemplatePositionFetcher } from '~position/template/custom-contract-position.template.position-fetcher';

import { LlamapayStreamApiClient } from '../common/llamapay.stream.api-client';
import { LlamapayViemContractFactory } from '../contracts';
import { LlamapayStream } from '../contracts/viem';

export type LlamapayStreamContractPositionDefinition = {
  address: string;
  tokenAddress: string;
};

export abstract class LlamapayStreamContractPositionFetcher extends CustomContractPositionTemplatePositionFetcher<
  LlamapayStream,
  DefaultDataProps,
  LlamapayStreamContractPositionDefinition
> {
  groupLabel = 'Streams';
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
    return this.contractFactory.llamapayStream({ address, network: this.network });
  }

  async getTokenDefinitions({
    definition,
  }: GetTokenDefinitionsParams<LlamapayStream, LlamapayStreamContractPositionDefinition>) {
    return [
      {
        address: definition.tokenAddress,
        metaType: MetaType.SUPPLIED,
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<LlamapayStream>) {
    return `${getLabelFromToken(contractPosition.tokens[0])} Llamapay Stream`;
  }

  getTokenBalancesPerPosition(): never {
    throw new NotImplementedException();
  }

  async getBalances(address: string) {
    const multicall = this.appToolkit.getViemMulticall(this.network);
    const streams = await this.apiClient.getStreams(address, this.subgraph);
    if (streams.length === 0) return [];

    const tokenLoader = this.appToolkit.getTokenDependencySelector({
      tags: { network: this.network, context: this.appId },
    });

    const underlyingAddresses = streams.map(stream => ({
      network: this.network,
      address: stream.token.address,
    }));

    const tokenDependencies = await tokenLoader.getMany(underlyingAddresses).then(deps => compact(deps));

    const positions = await Promise.all(
      streams.map(async stream => {
        const llamapayContract = this.contractFactory.llamapayStream({
          address: stream.contract.address.toLowerCase(),
          network: this.network,
        });
        const llamapay = multicall.wrap(llamapayContract);
        const streamBalanceRaw = await llamapay.read
          .withdrawable([stream.payer.id, stream.payee.id, BigInt(stream.amountPerSec)])
          .catch(err => {
            if (isViemMulticallUnderlyingError(err)) return null;
            throw err;
          });

        if (!streamBalanceRaw) return null;

        const token = tokenDependencies.find(t => t.address === stream.token.address);
        if (!token) return null;

        const balanceRaw = streamBalanceRaw[0].toString();
        const tokenBalance = drillBalance(token, balanceRaw);
        const balance = Number(balanceRaw) / 10 ** token.decimals;

        const position: ContractPositionBalance = {
          type: ContractType.POSITION,
          address: stream.contract.address,
          network: this.network,
          appId: this.appId,
          groupId: this.groupId,
          tokens: [tokenBalance],
          balanceUSD: tokenBalance.balanceUSD,

          dataProps: {
            balance,
          },

          displayProps: {
            label: `Available ${token.symbol} on LlamaPay`,
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
